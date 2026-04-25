#!/usr/bin/env node
// ARIA x-ray — 모든 라우트를 ?debug=tree 로 방문하여 printTree 출력을
// __snapshots__/aria/<slug>.txt 에 굳히고, 라우트 간 일관성을 체크한다.
//
// 사용법:
//   pnpm dev &   # 또는 SNAP_URL=... 로 다른 서버 지정
//   node scripts/aria-xray.mjs            # 검증(diff, 깨지면 exit 1)
//   node scripts/aria-xray.mjs --update   # 스냅샷 갱신
//   node scripts/aria-xray.mjs --report   # 일관성 리포트만 stdout

import { mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const outDir = resolve(root, '__snapshots__/aria')
const DEV_URL = process.env.SNAP_URL || 'http://localhost:5173'
const CHROME = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const MODE = process.argv.includes('--update') ? 'update'
  : process.argv.includes('--report') ? 'report'
  : 'verify'

const ROUTES = [
  { slug: 'finder',                url: '/finder/' },
  { slug: 'finder-mobile',         url: '/m/finder/' },
  { slug: 'inspector',             url: '/inspector' },
  { slug: 'ds-matrix',             url: '/ds-matrix' },
  { slug: 'atlas',                 url: '/atlas' },
  { slug: 'catalog',               url: '/catalog' },
  { slug: 'epa-dashboard',         url: '/edu-portal-admin/dashboard' },
  { slug: 'epa-videos',            url: '/edu-portal-admin/videos' },
  { slug: 'epa-role-categories',   url: '/edu-portal-admin/role-categories' },
  { slug: 'epa-course-categories', url: '/edu-portal-admin/course-categories' },
  { slug: 'epa-video-order',       url: '/edu-portal-admin/video-order' },
  { slug: 'genres',                url: '/genres' },
  { slug: 'genres-inbox',          url: '/genres/inbox' },
  { slug: 'genres-chat',           url: '/genres/chat' },
  { slug: 'genres-board',          url: '/genres/board' },
  { slug: 'genres-shop',           url: '/genres/shop' },
  { slug: 'genres-crm',            url: '/genres/crm' },
  { slug: 'genres-editor',         url: '/genres/editor' },
  { slug: 'genres-feed',           url: '/genres/feed' },
  { slug: 'genres-analytics',      url: '/genres/analytics' },
  { slug: 'genres-settings',       url: '/genres/settings' },
]

const log = (...a) => process.stderr.write('[aria-xray] ' + a.join(' ') + '\n')

async function devReachable() {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 1500)
    const r = await fetch(DEV_URL, { signal: ctrl.signal })
    clearTimeout(t)
    return r.ok || r.status < 500
  } catch { return false }
}

async function captureTree(browser, url) {
  const page = await browser.newPage()
  const logs = []
  page.on('console', msg => {
    if (msg.type() === 'log' || msg.type() === 'info') logs.push(msg.text())
  })
  try {
    const sep = url.includes('?') ? '&' : '?'
    await page.goto(url + sep + 'debug=tree', { waitUntil: 'networkidle2', timeout: 20000 })
    await new Promise(r => setTimeout(r, 600))
    // printTree 는 groupCollapsed 안에 들어 있고, 첫 console.log 가 트리 본문
    const tree = logs.find(l => l.startsWith('ROOT') || l.includes('├──') || l.includes('└──'))
    const outline = logs.find(l => l.startsWith('\n=== HEADING OUTLINE') || l.includes('=== HEADING OUTLINE ==='))
    return { tree: tree || '(no tree captured — Renderer not used or printTree disabled)', outline: outline || '' }
  } finally {
    await page.close()
  }
}

// ──────────────────────── consistency analysis ────────────────────────
// 라우트별 트리에서 (role, parent role, aria 사용 여부) 패턴을 추출하여
// 라우트 간에 같은 role 이 다른 패턴으로 쓰이는지 본다.

const ROLE_RX  = /role=(\S+)/
const ARIA_RX  = /aria=(".*?")(?=\s|$)/
const COMP_RX  = /<([A-Za-z]+)(?:\.[A-Za-z]+)?>/
const HINT_RX  = / ⚠ ([^]*?)$/

function parseTree(txt) {
  const lines = txt.split('\n')
  const stack = [{ depth: -1, role: null, comp: null }]
  const nodes = []  // { depth, role, comp, parentRole, parentComp, aria, hint }
  for (const raw of lines) {
    const m = raw.match(/^(?<indent>[│├└─\s]*?)(?<rest>[A-Za-z][^\s].*)$/)
    if (!m) continue
    const indent = m.groups.indent
    const depth = (indent.match(/(│   |    )/g) || []).length
    const rest = m.groups.rest
    const role = rest.match(ROLE_RX)?.[1] || null
    const comp = rest.match(COMP_RX)?.[1] || null
    const aria = rest.match(ARIA_RX)?.[1] || null
    const hint = rest.match(HINT_RX)?.[1] || null
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop()
    const parent = stack[stack.length - 1] || {}
    nodes.push({ depth, role, comp, aria, hint,
                 parentRole: parent.role, parentComp: parent.comp })
    stack.push({ depth, role, comp })
  }
  return nodes
}

function consistencyReport(perRoute) {
  // role → set of (parentRole|parentComp) 조합. 한 role 이 여러 부모 패턴에 걸쳐 있으면 의심.
  const rolePatterns = new Map() // role -> Map(pattern -> Set(slug))
  // role → aria-label 사용률 (있어야 하는 role 인지 정책 점검 시드)
  const roleAria = new Map()     // role -> { with: Set(slug), without: Set(slug) }
  // 힌트(⚠) 빈도
  const hintCount = new Map()    // hint -> Set(slug)
  // option/tab 처럼 부모가 listbox/tablist 여야 하는 약속
  const expectedParent = {
    option:    ['listbox'],
    tab:       ['tablist'],
    tabpanel:  null,            // 부모는 자유, 단 aria-labelledby 있어야 함 (별도 체크)
    menuitem:  ['menu', 'menubar', 'group'],
    treeitem:  ['tree', 'group'],
    row:       ['rowgroup', 'table', 'grid', 'treegrid'],
    gridcell:  ['row'],
    cell:      ['row'],
  }
  const violations = []

  for (const { slug, nodes } of perRoute) {
    for (const n of nodes) {
      if (n.role) {
        const pat = `parent=${n.parentRole || n.parentComp || 'ROOT'}`
        if (!rolePatterns.has(n.role)) rolePatterns.set(n.role, new Map())
        const m = rolePatterns.get(n.role)
        if (!m.has(pat)) m.set(pat, new Set())
        m.get(pat).add(slug)

        if (!roleAria.has(n.role)) roleAria.set(n.role, { with: new Set(), without: new Set() })
        const ra = roleAria.get(n.role)
        ;(n.aria ? ra.with : ra.without).add(slug)

        const exp = expectedParent[n.role]
        if (exp && !exp.includes(n.parentRole)) {
          violations.push({ slug, role: n.role, parent: n.parentRole, expected: exp })
        }
      }
      if (n.hint) {
        const key = n.hint.split(';')[0].trim()
        if (!hintCount.has(key)) hintCount.set(key, new Set())
        hintCount.get(key).add(slug)
      }
    }
  }

  const lines = []
  lines.push('# ARIA Consistency Report\n')
  lines.push(`Routes scanned: ${perRoute.length}\n`)

  lines.push('## Role parent-pattern drift')
  lines.push('한 role 이 여러 부모 패턴으로 쓰이면 책임 분산 의심.\n')
  for (const [role, pats] of [...rolePatterns].sort((a,b) => b[1].size - a[1].size)) {
    if (pats.size <= 1) continue
    lines.push(`- **${role}** — ${pats.size} patterns:`)
    for (const [pat, slugs] of pats) lines.push(`  - \`${pat}\` (${slugs.size}× : ${[...slugs].slice(0,4).join(', ')}${slugs.size>4?'…':''})`)
  }

  lines.push('\n## aria-label 사용률')
  lines.push('같은 role 인데 한쪽은 aria 있고 한쪽은 없으면 일관성 갭.\n')
  for (const [role, { with: w, without: wo }] of [...roleAria].sort()) {
    if (w.size === 0 || wo.size === 0) continue
    lines.push(`- **${role}** — with aria: ${w.size}, without: ${wo.size}`)
    lines.push(`  - missing in: ${[...wo].join(', ')}`)
  }

  lines.push('\n## Required parent violations')
  if (violations.length === 0) lines.push('(none)')
  for (const v of violations) {
    lines.push(`- \`${v.slug}\` — role=${v.role} parent=${v.parent || 'none'} (expected: ${v.expected.join('|')})`)
  }

  lines.push('\n## Hint frequency (printTree ⚠)')
  for (const [hint, slugs] of [...hintCount].sort((a,b) => b[1].size - a[1].size)) {
    lines.push(`- ${slugs.size}× — ${hint}`)
    lines.push(`  - in: ${[...slugs].join(', ')}`)
  }

  return { text: lines.join('\n') + '\n', violationsCount: violations.length }
}

// ──────────────────────── main ────────────────────────
async function main() {
  if (!existsSync(CHROME)) { log('Chrome not found at', CHROME); process.exit(2) }
  if (!await devReachable()) { log('dev server unreachable at', DEV_URL, '— start `pnpm dev` first'); process.exit(2) }

  mkdirSync(outDir, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--hide-scrollbars', '--disable-gpu'],
  })

  const perRoute = []
  let diffCount = 0
  let missCount = 0

  try {
    for (const r of ROUTES) {
      try {
        const { tree, outline } = await captureTree(browser, DEV_URL + r.url)
        const body = tree + (outline ? '\n\n' + outline : '') + '\n'
        const file = resolve(outDir, `${r.slug}.txt`)

        if (MODE === 'update') {
          writeFileSync(file, body)
          log('✓ wrote', r.slug)
        } else if (MODE === 'verify') {
          const prev = existsSync(file) ? readFileSync(file, 'utf8') : null
          if (prev == null) { log('? missing snapshot:', r.slug); missCount++ }
          else if (prev !== body) {
            log('✗ diff:', r.slug)
            diffCount++
          } else log('=', r.slug)
        }
        perRoute.push({ slug: r.slug, nodes: parseTree(tree) })
      } catch (e) {
        log('✗', r.slug, String(e.message || e).slice(0, 120))
      }
    }
  } finally {
    await browser.close()
  }

  const report = consistencyReport(perRoute)
  const reportPath = resolve(outDir, '_consistency.md')
  if (MODE === 'update' || MODE === 'verify') writeFileSync(reportPath, report.text)
  if (MODE === 'report') process.stdout.write(report.text)

  log(`done — diff:${diffCount} missing:${missCount} violations:${report.violationsCount}`)
  if (MODE === 'verify' && (diffCount > 0 || missCount > 0)) process.exit(1)
}

main().catch(e => { log('fatal', String(e)); process.exit(2) })

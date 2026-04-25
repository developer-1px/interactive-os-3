#!/usr/bin/env node
// ARIA x-ray — 모든 라우트를 ?debug=tree 로 방문해서 printTree 출력을 모아 출력한다.
// 결정적 게이트가 아니라, 사람(또는 Claude)이 한눈에 보고 판단하기 위한 덤프.
//
// 사용법:
//   pnpm dev &
//   node scripts/aria-xray.mjs                  # 모든 라우트, stdout 으로 한 덩어리
//   node scripts/aria-xray.mjs genres-chat      # 특정 슬러그만
//   node scripts/aria-xray.mjs --write          # __snapshots__/aria/<slug>.txt 로 추가 저장

import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const outDir = resolve(root, '__snapshots__/aria')
const DEV_URL = process.env.SNAP_URL || 'http://localhost:5173'
const CHROME = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const args = process.argv.slice(2)
const WRITE = args.includes('--write')
const filterSlugs = args.filter(a => !a.startsWith('--'))

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
    const tree = logs.find(l => l.startsWith('__root__') || l.startsWith('ROOT') || l.includes('├──') || l.includes('└──'))
    const outline = logs.find(l => l.includes('=== HEADING OUTLINE ==='))
    return { tree: tree || '(no FlatLayout tree — Renderer not used on this route)', outline: outline || '' }
  } finally {
    await page.close()
  }
}

async function main() {
  if (!await devReachable()) { log('dev server unreachable at', DEV_URL, '— start `pnpm dev` first'); process.exit(2) }
  if (WRITE) mkdirSync(outDir, { recursive: true })

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--hide-scrollbars', '--disable-gpu'],
  })

  const targets = filterSlugs.length ? ROUTES.filter(r => filterSlugs.includes(r.slug)) : ROUTES

  try {
    for (const r of targets) {
      try {
        const { tree, outline } = await captureTree(browser, DEV_URL + r.url)
        const body = tree + (outline ? '\n\n' + outline : '')
        process.stdout.write(`\n\n========== ${r.slug}  ${r.url} ==========\n${body}\n`)
        if (WRITE) writeFileSync(resolve(outDir, `${r.slug}.txt`), body + '\n')
        log('✓', r.slug)
      } catch (e) {
        log('✗', r.slug, String(e.message || e).slice(0, 120))
      }
    }
  } finally {
    await browser.close()
  }
}

main().catch(e => { log('fatal', String(e)); process.exit(2) })

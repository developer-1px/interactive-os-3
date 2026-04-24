#!/usr/bin/env node
// 외부 발표용 진화 아카이브.
// Stop 훅에서 async 실행 — 턴마다 바뀐 라우트 + catalog 를 dev 서버에서 촬영.
// 조용히 실패한다: dev 서버가 안 떠 있으면 그냥 스킵.

import { execSync } from 'node:child_process'
import { mkdirSync, appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const outDir = resolve(root, 'docs/evolution')
const timelinePath = resolve(outDir, 'timeline.jsonl')
const DEV_URL = process.env.SNAP_URL || 'http://localhost:5173'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const ROUTES = [
  { slug: 'catalog', url: '/catalog' },
  { slug: 'finder', url: '/finder/' },
  { slug: 'inspector', url: '/inspector' },
  { slug: 'ds-matrix', url: '/ds-matrix' },
  { slug: 'atlas', url: '/atlas' },
  { slug: 'edu-portal-admin', url: '/edu-portal-admin/dashboard' },
  { slug: 'genres', url: '/genres' },
  { slug: 'genres-chat', url: '/genres/chat' },
  { slug: 'genres-shop', url: '/genres/shop' },
  { slug: 'genres-crm', url: '/genres/crm' },
  { slug: 'genres-feed', url: '/genres/feed' },
  { slug: 'genres-editor', url: '/genres/editor' },
  { slug: 'genres-analytics', url: '/genres/analytics' },
  { slug: 'genres-settings', url: '/genres/settings' },
  { slug: 'genres-inbox', url: '/genres/inbox' },
]

function log(...a) { process.stderr.write('[snap-evolution] ' + a.join(' ') + '\n') }

async function devReachable() {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 800)
    const r = await fetch(DEV_URL, { signal: ctrl.signal })
    clearTimeout(t)
    return r.ok || r.status < 500
  } catch { return false }
}

function changedFiles() {
  try {
    const out = execSync('git diff --name-only HEAD; git diff --name-only; git ls-files --others --exclude-standard',
      { cwd: root, encoding: 'utf8' })
    return [...new Set(out.split('\n').map(s => s.trim()).filter(Boolean))]
      .filter(f => !f.startsWith('docs/evolution/'))
  } catch { return [] }
}

function pickRoutes(files) {
  // catalog 는 항상 — "DS 진화"의 대표 프레임
  const picked = new Map()
  picked.set('catalog', ROUTES[0])
  const dsChanged = files.some(f => f.startsWith('src/ds/'))
  // ds/** 바뀌면 catalog 1장으로 충분 (역인덱스)
  // routes/<slug>/** 바뀐 라우트는 추가로
  for (const f of files) {
    const m = f.match(/^src\/routes\/([^/]+)\//)
    if (!m) continue
    const slug = m[1] === 'genres' ? (f.match(/^src\/routes\/genres\/([^/]+)\//)?.[1] ? `genres-${f.match(/^src\/routes\/genres\/([^/]+)\//)[1]}` : 'genres') : m[1]
    const route = ROUTES.find(r => r.slug === slug)
    if (route) picked.set(slug, route)
  }
  return { routes: [...picked.values()], dsChanged }
}

async function shoot(browser, url) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 })
    await new Promise(r => setTimeout(r, 400))
    return await page.screenshot({ fullPage: false })
  } finally {
    await page.close()
  }
}

function lastHashPerSlug() {
  const map = new Map()
  if (!existsSync(timelinePath)) return map
  const lines = readFileSync(timelinePath, 'utf8').split('\n').filter(Boolean)
  for (const line of lines) {
    try {
      const e = JSON.parse(line)
      if (e.hash) map.set(e.slug, e.hash)
    } catch { /* ignore */ }
  }
  return map
}

function commitSha() {
  try { return execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim() } catch { return null }
}

async function main() {
  if (!existsSync(CHROME)) { log('Chrome not found, skip'); return }
  if (!await devReachable()) { log('dev server not reachable at', DEV_URL, '— skip'); return }

  const files = changedFiles()
  if (files.length === 0) { log('no changes, skip'); return }

  const { routes } = pickRoutes(files)
  if (routes.length === 0) { log('no matching routes'); return }

  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const sha = commitSha()
  mkdirSync(outDir, { recursive: true })

  const prev = lastHashPerSlug()
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--hide-scrollbars', '--disable-gpu'],
  })
  try {
    for (const r of routes) {
      try {
        const buf = await shoot(browser, DEV_URL + r.url)
        const hash = createHash('sha1').update(buf).digest('hex').slice(0, 12)
        if (prev.get(r.slug) === hash) { log('= ', r.slug, '(dup skip)'); continue }
        const png = resolve(outDir, r.slug, `${ts}.png`)
        mkdirSync(dirname(png), { recursive: true })
        writeFileSync(png, buf)
        const rel = png.replace(root + '/', '')
        appendFileSync(timelinePath, JSON.stringify({
          ts, slug: r.slug, url: r.url, file: rel, hash, sha, files: files.slice(0, 20),
        }) + '\n')
        log('✓', r.slug, hash)
      } catch (e) {
        log('✗', r.slug, String(e.message || e).slice(0, 80))
      }
    }
  } finally {
    await browser.close()
  }
}

main().catch(e => { log('fatal', String(e)); process.exit(0) })

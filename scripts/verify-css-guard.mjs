#!/usr/bin/env node
/** dsCss assertUniqueSelectors 가드 검증 — 헤드리스 브라우저로 dev 페이지 로드, 콘솔 에러 확인. */
import puppeteer from 'puppeteer-core'
import { execSync } from 'node:child_process'

const URL = process.argv[2] || 'http://localhost:5176/'
const chromePath = execSync('which google-chrome 2>/dev/null || which chromium 2>/dev/null || mdfind -name "Google Chrome.app" | head -1')
  .toString().trim()
const executablePath = chromePath.endsWith('.app')
  ? `${chromePath}/Contents/MacOS/Google Chrome`
  : chromePath

const browser = await puppeteer.launch({ executablePath, headless: 'new' })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`) })

try {
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 15000 })
  console.log('✅ 페이지 로드 완료')
  if (errors.length > 0) {
    console.log('🔴 에러 ' + errors.length + '건:')
    for (const e of errors) console.log('  ' + e)
    process.exit(1)
  } else {
    console.log('✅ 콘솔 에러 없음 — assertUniqueSelectors 통과')
  }
} catch (e) {
  console.log('❌ goto 실패:', e.message)
  if (errors.length > 0) for (const er of errors) console.log('  ' + er)
  process.exit(1)
} finally {
  await browser.close()
}

import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })

  page.on('pageerror', (err) => console.error('[pageerror]', err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning')
      console.error('[' + msg.type() + ']', msg.text())
  })
  page.on('requestfailed', (req) => console.error('[reqfail]', req.url(), req.failure()?.errorText))

  for (const path of ['/', '/patterns', '/apps/finder/', '/apps/slides/docs/slides-sample.md', '/apps/admin/dashboard']) {
    await page.goto('http://127.0.0.1:5274' + path, { waitUntil: 'networkidle2', timeout: 15000 }).catch((e) => console.error('[goto]', path, e.message))
    await page.screenshot({ path: '/tmp/snap-' + path.replace(/\//g, '_') + '.png', fullPage: false })
    const title = await page.title()
    const rootHtml = await page.$eval('#root', el => el.innerHTML.length).catch(() => 0)
    console.log(path, '→ title:', title, 'rootHtml.length:', rootHtml)
  }
} finally {
  await browser.close()
}

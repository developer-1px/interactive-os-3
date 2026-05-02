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

  for (const slug of ['listbox', 'treegrid', 'menu', 'dialog', 'combobox', 'slider', 'tabs']) {
    await page.goto('http://127.0.0.1:5274/patterns#' + slug, { waitUntil: 'networkidle2', timeout: 15000 }).catch((e) => console.error('[goto]', slug, e.message))
    await new Promise(r => setTimeout(r, 500))
    await page.screenshot({ path: '/tmp/snap-pattern-' + slug + '.png', fullPage: false })
    const target = await page.$eval('#' + slug, el => ({
      rect: el.getBoundingClientRect ? el.getBoundingClientRect().y : null,
      hasContent: el.innerHTML.length,
    })).catch(() => null)
    console.log(slug, '→', target)
  }
} finally {
  await browser.close()
}

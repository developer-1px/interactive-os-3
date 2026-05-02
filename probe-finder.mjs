import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900 })

  page.on('pageerror', (err) => console.error('[pageerror]', err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning')
      console.error('[' + msg.type() + ']', msg.text())
  })

  await page.goto('http://127.0.0.1:5274/apps/finder/', { waitUntil: 'networkidle2', timeout: 15000 })
  await new Promise(r => setTimeout(r, 800))

  // 1) Initial DOM presence
  const probe = await page.evaluate(() => {
    const titleEl = document.querySelector('main[aria-label]')
    const sidebarLis = document.querySelectorAll('aside ul[role="listbox"] li[role="option"]')
    const columnsCols = document.querySelectorAll('section[aria-label="컬럼"] nav[role], section[aria-label="컬럼"] nav')
    const columnsLis = document.querySelectorAll('section[aria-label="컬럼"] li[role="option"]')
    const search = document.querySelector('input[type="search"]')
    return {
      title: titleEl?.getAttribute('aria-label'),
      sidebarItems: sidebarLis.length,
      columns: columnsCols.length,
      columnItems: columnsLis.length,
      hasSearch: !!search,
    }
  })
  console.log('initial', probe)

  await page.screenshot({ path: '/tmp/finder-initial.png' })

  // 2) Click first column item
  const before = page.url()
  const clicked = await page.evaluate(() => {
    const li = document.querySelector('section[aria-label="컬럼"] li[role="option"]:not([aria-disabled])')
    if (!li) return null
    const text = li.textContent
    li.click()
    return text
  })
  await new Promise(r => setTimeout(r, 600))
  const after = page.url()
  console.log('clicked column item:', clicked, '\nbefore:', before, '\nafter:', after)

  await page.screenshot({ path: '/tmp/finder-after-click.png' })

  // 3) Click first sidebar item
  const sidebarClicked = await page.evaluate(() => {
    const li = document.querySelector('aside ul[role="listbox"] li[role="option"]:not([aria-disabled])')
    if (!li) return null
    const text = li.textContent
    li.click()
    return text
  })
  await new Promise(r => setTimeout(r, 600))
  const after2 = page.url()
  console.log('clicked sidebar item:', sidebarClicked, '\nafter sidebar:', after2)
  await page.screenshot({ path: '/tmp/finder-after-sidebar.png' })

  // 4) Try arrow-down inside columns
  const focusInfo = await page.evaluate(() => {
    const li = document.querySelector('section[aria-label="컬럼"] li[role="option"]')
    if (li) li.focus()
    return { focused: document.activeElement?.tagName + ':' + document.activeElement?.textContent?.slice(0,20) }
  })
  console.log('focus before key:', focusInfo)
  await page.keyboard.press('ArrowDown')
  await new Promise(r => setTimeout(r, 400))
  const focusAfter = await page.evaluate(() => ({
    activeText: document.activeElement?.textContent?.slice(0,30),
    activeRole: document.activeElement?.getAttribute('role'),
    url: window.location.href,
  }))
  console.log('after ArrowDown:', focusAfter)
} finally {
  await browser.close()
}

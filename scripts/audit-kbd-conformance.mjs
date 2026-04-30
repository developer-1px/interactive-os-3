#!/usr/bin/env node
/**
 * audit-kbd-conformance — APG 키보드 동작 자동 검증.
 *
 * /keyboard 라우트에 있는 10개 fixture(Menu, Listbox, Tree, Columns, Radio,
 * Checkbox, Tabs, Toolbar, Combobox, Select)에 대해 APG-required 키 시퀀스를
 * 실행하고 focus(또는 aria-activedescendant) 이동을 검증한다.
 *
 * 사용법:
 *   pnpm dev &
 *   pnpm audit:kbd                    # 모든 fixture
 *   pnpm audit:kbd Menu               # 특정 fixture
 *   VERBOSE=1 pnpm audit:kbd Toolbar  # 키별 trace 출력
 *
 * 검증 기준:
 *   - entrySelector로 fixture 진입 (popup pattern은 initKeys로 prep)
 *   - APG key 누른 후 focus 또는 aria-activedescendant가 변해야 함
 *   - 같은 element + 같은 activedescendant = focus 변화 없음 (실패)
 *
 * Known limitations (현재 7/10 pass):
 *   - Select  : native <select> — puppeteer headless 키보드 한계 (실사용자 OK)
 *   - Combobox: ds Combobox는 ARIA-wiring 전용 dumb input, kbd 통합 없음 (아키텍처)
 *   - CheckboxGroup: useRoving 내부 state가 manual .focus()로 갱신 안 됨 (테스트 한계)
 */
import puppeteer from 'puppeteer-core'

const DEV_URL = process.env.DEV_URL || 'http://localhost:5173'
const CHROME = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const args = process.argv.slice(2)
const filter = args.filter(a => !a.startsWith('--'))
const log = (...a) => process.stderr.write('[kbd-conformance] ' + a.join(' ') + '\n')

/**
 * Fixture 사양 — Section title (page에 표시되는 섹션 헤더) + APG key 시퀀스.
 *
 * key는 puppeteer Page.keyboard.press 인자.
 * checks: 키를 누른 후 검증할 조건. 모든 check가 통과해야 fixture pass.
 */
/**
 * entrySelector: fixture 내부에서 첫 진입할 element를 가리킨다.
 *   기본은 role= 가진 컬렉션의 자식 중 첫 element. popup pattern은 trigger 버튼.
 * initKeys: 진입 후 메인 keys 전에 누를 prep 키 (popup 열기 등).
 */
const FIXTURES = [
  {
    name: 'Menu',
    title: 'Menu',
    entrySelector: '[role="menu"] [role="menuitem"], [aria-haspopup]',
    initKeys: ['Enter'],
    keys: ['ArrowDown', 'ArrowDown', 'Home', 'End'],
  },
  {
    name: 'Listbox',
    title: 'Listbox',
    entrySelector: '[role="listbox"] [role="option"]',
    keys: ['ArrowDown', 'ArrowDown', 'Home', 'End'],
  },
  {
    name: 'Tree',
    title: 'Tree',
    entrySelector: '[role="tree"] [role="treeitem"]',
    keys: ['ArrowDown', 'ArrowDown', 'Home', 'End'],
  },
  {
    name: 'Columns',
    title: 'Columns',
    entrySelector: '[role="tree"] [role="treeitem"]',
    keys: ['ArrowDown', 'ArrowDown', 'ArrowRight'],
  },
  {
    name: 'RadioGroup',
    title: 'RadioGroup',
    entrySelector: '[role="radiogroup"] [role="radio"]',
    keys: ['ArrowDown', 'ArrowDown', 'ArrowUp'],
  },
  {
    name: 'CheckboxGroup',
    title: 'CheckboxGroup',
    entrySelector: '[role="group"] [role="checkbox"]',
    keys: ['ArrowDown', 'ArrowDown', 'ArrowUp'],
  },
  {
    name: 'Tabs',
    title: 'Tabs',
    entrySelector: '[role="tablist"] [role="tab"]',
    keys: ['ArrowRight', 'ArrowRight', 'ArrowLeft', 'Home', 'End'],
  },
  {
    name: 'Toolbar',
    title: 'Toolbar',
    entrySelector: '[role="toolbar"] button',
    keys: ['ArrowRight', 'ArrowRight', 'ArrowLeft', 'Home', 'End'],
  },
  {
    name: 'Combobox',
    title: 'Combobox',
    entrySelector: '[role="combobox"]',
    initKeys: ['ArrowDown'],
    keys: ['ArrowDown', 'ArrowDown'],
  },
  {
    name: 'Select',
    title: 'Select',
    entrySelector: '[role="combobox"]',
    initKeys: ['Enter'],
    keys: ['ArrowDown', 'ArrowDown'],
  },
]

async function devReachable() {
  try {
    const r = await fetch(DEV_URL, { method: 'HEAD' })
    return r.status < 500
  } catch { return false }
}

/**
 * fixture 안에 포커스를 진입시킨다.
 * 우선 entrySelector 시도 — 못 찾으면 첫 tabbable로 fallback.
 */
async function focusFixture(page, fixtureTitle, entrySelector) {
  return page.evaluate(({ title, entrySelector }) => {
    const sec = document.querySelector(`section[aria-labelledby="kb-${title}"]`)
    if (!sec) return { ok: false, reason: 'section not found' }
    const fix = sec.querySelector('[data-part="fixture"]')
    if (!fix) return { ok: false, reason: 'fixture frame not found' }
    let target = entrySelector ? fix.querySelector(entrySelector) : null
    if (!target) {
      target = fix.querySelector(
        'button:not([disabled]), [tabindex="0"], [tabindex="-1"], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'
      )
    }
    if (!target) return { ok: false, reason: 'no entry target found' }
    if (target.tabIndex < 0 && target.getAttribute('tabindex') == null) {
      target.tabIndex = 0
    }
    if (typeof target.focus === 'function') target.focus()
    return { ok: true, entered: target.tagName.toLowerCase() + (target.getAttribute('role') ? `[role=${target.getAttribute('role')}]` : '') }
  }, { title: fixtureTitle, entrySelector })
}

async function readFocus(page) {
  return page.evaluate(() => {
    const el = document.activeElement
    if (!el) return null
    return {
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role'),
      label: el.getAttribute('aria-label') ?? (el.textContent || '').trim().slice(0, 30),
      id: el.id || el.getAttribute('data-id') || null,
      text: (el.textContent || '').trim().slice(0, 30) || el.getAttribute('aria-label') || '',
      // activedescendant 패턴 (combobox/listbox/grid)에서 focus 자체는 그대로지만
      // active 옵션이 바뀐다 — 이 변화도 진행 신호로 본다.
      activeDescendant: el.getAttribute('aria-activedescendant') || null,
    }
  })
}

async function auditFixture(browser, fixture) {
  const page = await browser.newPage()
  const issues = []
  const trace = []
  try {
    await page.goto(DEV_URL + '/keyboard', { waitUntil: 'networkidle2', timeout: 20000 })
    await new Promise(r => setTimeout(r, 400))
    const entry = await focusFixture(page, fixture.title, fixture.entrySelector)
    if (!entry.ok) {
      issues.push(`진입 실패: ${entry.reason}`)
      return { name: fixture.name, pass: false, issues, trace }
    }
    // initKeys: popup 열기 등 prep
    for (const key of (fixture.initKeys ?? [])) {
      await page.keyboard.press(key)
      await new Promise(r => setTimeout(r, 60))
    }
    const initial = await readFocus(page)
    trace.push({ key: `<entry:${entry.entered}>`, focus: initial })

    if (!initial) {
      issues.push('진입 후 focus 없음')
      return { name: fixture.name, pass: false, issues, trace }
    }

    let prev = initial
    for (const key of fixture.keys) {
      await page.keyboard.press(key)
      await new Promise(r => setTimeout(r, 50))
      const cur = await readFocus(page)
      trace.push({ key, focus: cur })
      if (!cur) {
        issues.push(`${key}: focus 사라짐`)
        break
      }
      // focus element가 그대로지만 aria-activedescendant가 바뀌면 진행 신호 (combobox/listbox)
      const sameElement = cur.text === prev.text && cur.id === prev.id
      const sameActiveDesc = cur.activeDescendant === prev.activeDescendant
      if (sameElement && sameActiveDesc) {
        // 첫 ArrowDown은 자기 자리 유지일 수도(이미 첫 항목) — 허용
        if (trace.length > 2 && (key.startsWith('Arrow') || key === 'Home' || key === 'End')) {
          const ad = cur.activeDescendant ? ` activedesc="${cur.activeDescendant}"` : ''
          issues.push(`${key}: focus 변화 없음 (text="${cur.text}" id="${cur.id}"${ad})`)
        }
      }
      prev = cur
    }
    return { name: fixture.name, pass: issues.length === 0, issues, trace }
  } catch (e) {
    issues.push(`exception: ${e.message || e}`)
    return { name: fixture.name, pass: false, issues, trace }
  } finally {
    await page.close()
  }
}

function fmt(r) {
  const status = r.pass ? '✅' : '❌'
  const out = [`${status} ${r.name}`]
  if (r.issues.length) {
    for (const i of r.issues) out.push(`     · ${i}`)
  }
  if (process.env.VERBOSE) {
    for (const t of r.trace) {
      const f = t.focus
      const id = f?.id ? `#${f.id}` : ''
      out.push(`     ${t.key.padEnd(10)} → ${f?.tag}${id} role=${f?.role} "${f?.text}"`)
    }
  }
  return out.join('\n')
}

async function main() {
  if (!await devReachable()) {
    log('dev server unreachable at', DEV_URL, '— start `pnpm dev` first')
    process.exit(2)
  }
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--hide-scrollbars', '--disable-gpu'],
  })
  const targets = filter.length
    ? FIXTURES.filter(f => filter.includes(f.name))
    : FIXTURES
  const results = []
  try {
    for (const f of targets) {
      const r = await auditFixture(browser, f)
      results.push(r)
      process.stdout.write(fmt(r) + '\n')
    }
  } finally {
    await browser.close()
  }

  const failed = results.filter(r => !r.pass)
  const summary = `\n${results.length - failed.length}/${results.length} fixtures passed`
  process.stdout.write(summary + '\n')
  process.exit(failed.length === 0 ? 0 : 1)
}

main().catch(e => { log('fatal', String(e)); process.exit(2) })

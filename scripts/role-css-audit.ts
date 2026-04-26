#!/usr/bin/env -S npx tsx
// role × CSS 커버리지 감사 — dsCss 전체 문자열을 스캔하여 ARIA role별 필수 상태가
// CSS에 선언되어 있는지 확인한다. "role에 맞는 CSS를 바르게 쓰고 있는가"의 정적 지표.
//
// - 데모/런타임 DOM은 보지 않는다. 생성된 ds.css 문자열만의 정적 분석.
// - states는 role이 실제로 노출하는 ARIA 속성 / 키보드 상태 / data-* 훅 기준.
// dsCss는 import.meta.glob(vite 전용)을 거쳐 생성되므로 런타임 import 대신
// style 소스 트리의 .ts 파일 텍스트를 모두 이어붙여 정적 스캔한다.
// 셀렉터는 template literal 안에 리터럴로 적혀있어 텍스트 매칭만으로 충분하다.
// (selectors.ts의 flexItem/subgridItem/rovingItem 같은 이름도 텍스트에 그대로 등장)
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
const STYLE_ROOT = new URL('../packages/ds/src/style', import.meta.url).pathname
function collect(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) collect(p, out)
    else if (/\.ts$/.test(name)) out.push(readFileSync(p, 'utf8'))
  }
  return out
}
// selectors.ts의 상수들을 먼저 인라인 치환 — rovingItem / subgridItem / flexItem / tableItem /
// clickable / control 이름이 css`` 안에 쓰이면 실제 role 셀렉터로 풀어주어야 정확히 검사된다.
const selectorsText = readFileSync(join(STYLE_ROOT, 'states/selectors.ts'), 'utf8')
function extractList(name: string): string {
  const re = new RegExp(`export const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]\\.join`, 'm')
  const m = selectorsText.match(re)
  if (!m) return ''
  return m[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '').replace(/^['"]/, '').replace(/['"]$/, '')).filter(Boolean).join(', ')
}
const CONST_EXPANSIONS: Record<string, string> = {
  subgridItem: extractList('subgridItem'),
  flexItem: extractList('flexItem'),
  tableItem: extractList('tableItem'),
}
// rovingItem / clickable / control은 다른 상수 합성 — 최종 resolve
CONST_EXPANSIONS.rovingItem = [CONST_EXPANSIONS.subgridItem, CONST_EXPANSIONS.flexItem, CONST_EXPANSIONS.tableItem].filter(Boolean).join(', ')
CONST_EXPANSIONS.control = 'button, [role="button"], input, select, textarea'
CONST_EXPANSIONS.clickable = ['button', '[role="button"]', CONST_EXPANSIONS.subgridItem, CONST_EXPANSIONS.flexItem].filter(Boolean).join(', ')

let dsCss: string = collect(STYLE_ROOT).join('\n')
// `${rovingItem}` / `${flexItem}` 같은 template literal 자리표시자를 실제 selector list로 치환
for (const [name, val] of Object.entries(CONST_EXPANSIONS)) {
  dsCss = dsCss.split('${' + name + '}').join(val)
}

// states/index.ts의 helper 호출을 상태 attr로 "가상 확장"해 dsCss 텍스트에 덧붙인다.
// fn/state.ts는 Vite 전용 체인 밖에 있으므로 직접 임포트 대신 호출 규약을 정적으로 해석:
//   selected(x)    → x의 각 role에 [aria-selected="true"], [aria-current="true"], [aria-pressed="true"], [aria-checked="true"]
//   hover(x)       → :hover
//   focus(x)       → :focus-visible
//   active(x)      → :active
//   disabled(x)    → [aria-disabled="true"]
//   highlighted(x) → :focus
const STATE_HELPERS: Record<string, string[]> = {
  selected:    ['[aria-selected="true"]', '[aria-current="true"]', '[aria-pressed="true"]', '[aria-checked="true"]'],
  hover:       [':hover'],
  focus:       [':focus-visible'],
  active:      [':active'],
  disabled:    ['[aria-disabled="true"]'],
  highlighted: [':focus'],
}
const statesIndex = readFileSync(join(STYLE_ROOT, 'states/index.ts'), 'utf8')
const synthetic: string[] = []
for (const [helper, attrs] of Object.entries(STATE_HELPERS)) {
  const re = new RegExp(`\\b${helper}\\s*\\(\\s*(\\w+)\\s*\\)`, 'g')
  for (const m of statesIndex.matchAll(re)) {
    const arg = m[1] // rovingItem / control / subgridItem ...
    const expansion = CONST_EXPANSIONS[arg]
    if (!expansion) continue
    for (const role of expansion.split(',').map((s) => s.trim())) {
      for (const attr of attrs) synthetic.push(`${role}${attr} { /* synthesized from ${helper}(${arg}) */ }`)
    }
  }
}
dsCss += '\n' + synthetic.join('\n')

// ui/가 emit하는 role을 역스캔 — 코드가 role=X를 내보내는데 CSS가 모르면 그게 갭.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
const UI_ROOT = new URL('../packages/ds/src/ui', import.meta.url).pathname
const emittedRoles = new Set<string>()
const emitters: Record<string, string[]> = {}
function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) { walk(p); continue }
    if (!/\.(tsx|ts)$/.test(name)) continue
    const text = readFileSync(p, 'utf8')
    for (const line of text.split('\n')) {
      if (/aria-roledescription\s*=/.test(line)) continue
      const m = line.match(/(?:^|[\s{(])role=["']([a-z]+)["']/)
      if (!m) continue
      const role = m[1]
      emittedRoles.add(role)
      ;(emitters[role] ||= []).push(p.replace(UI_ROOT + '/', ''))
    }
  }
}
walk(UI_ROOT)

// ARIA role → 네이티브 대체 엘리먼트/셀렉터. 네이티브로 처리되면 CSS가 tag를 셀렉트해도 OK.
const NATIVE_FALLBACK: Record<string, string> = {
  slider: 'input[type="range"]',
  progressbar: 'progress',
  dialog: 'dialog',
  button: 'button',
  checkbox: 'input[type="checkbox"]',
  radio: 'input[type="radio"]',
  separator: 'hr',
  article: 'article',
}

type Req = { attr: string; desc: string }

// 각 role에 대해 "있으면 좋다"가 아니라 "이 role을 쓸 때 시각 구분이 반드시 필요한 상태"만 넣는다.
// 불필요한 노이즈는 배제 — 감사는 엄격해야 가치가 있다.
const ROLE_MATRIX: Record<string, { states: Req[] }> = {
  // 메뉴
  menu: { states: [] },
  menubar: { states: [] },
  menuitem: { states: [
    { attr: '[aria-disabled', desc: 'disabled 시각 구분' },
    { attr: '[aria-expanded="true"]', desc: '하위 메뉴 열린 상태' },
    { attr: '[aria-haspopup', desc: 'submenu 표식' },
  ]},
  menuitemcheckbox: { states: [{ attr: '[aria-checked="true"]', desc: 'check 표식' }] },
  menuitemradio:    { states: [{ attr: '[aria-checked="true"]', desc: 'radio 표식' }] },

  // 리스트/트리
  listbox:  { states: [] },
  option:   { states: [
    { attr: '[aria-selected="true"]', desc: '선택 상태' },
    { attr: '[aria-disabled',         desc: 'disabled' },
  ]},
  combobox: { states: [{ attr: '[aria-expanded="true"]', desc: '팝업 열린 상태' }] },
  tree:     { states: [] },
  treeitem: { states: [
    { attr: '[aria-expanded',  desc: '분기 펼침/접힘' },
    { attr: '[aria-selected',  desc: '선택 상태' },
    { attr: '[aria-level',     desc: '들여쓰기 레벨' },
  ]},
  treegrid: { states: [] },

  // 탭
  tablist:  { states: [] },
  tab:      { states: [{ attr: '[aria-selected="true"]', desc: '활성 탭' }] },
  tabpanel: { states: [] },

  // 그리드/테이블
  grid: { states: [] },
  row:  { states: [] },
  rowheader:    { states: [] },
  columnheader: { states: [] },
  gridcell:     { states: [] },

  // 폼 요소
  button: { states: [
    { attr: '[aria-pressed',  desc: 'toggle 상태' },
    { attr: '[aria-expanded', desc: 'disclosure/popover 상태' },
  ]},
  checkbox:    { states: [{ attr: '[aria-checked',  desc: 'checked 시각' }] },
  radio:       { states: [{ attr: '[aria-checked',  desc: 'checked 시각' }] },
  switch:      { states: [{ attr: '[aria-checked',  desc: 'on/off' }] },
  slider:      { states: [{ attr: '[aria-valuenow', desc: '현재 값 표시' }] },
  progressbar: { states: [{ attr: '[aria-valuenow', desc: '현재 값 표시' }] },

  // 오버레이/구조
  dialog:    { states: [] },
  tooltip:   { states: [] },
  toolbar:   { states: [] },
  separator: { states: [] },

  // 콘텐츠
  article: { states: [] },
  feed:    { states: [] },
}

// 모든 role 공통 — 시각적 기본기
const COMMON: Req[] = [
  { attr: ':focus-visible', desc: '포커스링' },
]

// 공통 검사는 "roving 가능한 role"에만 적용 — dialog/tooltip/feed 등에 요구하면 노이즈
const ROVING_ROLES = new Set([
  'menuitem','menuitemcheckbox','menuitemradio','option','treeitem',
  'tab','button','checkbox','radio','switch',
])

const css: string = dsCss

// role 섹션만 추출 (대략): 해당 role을 포함한 selector를 기준으로 검사.
// CSS에 `[role="X"]` 셀렉터가 있는 블록이 아니라, CSS 전체 문자열에서
// `[role="X"]` + state attr이 한 셀렉터에 함께 나타나는 규칙을 찾는다.
function hasRoleWithState(role: string, stateAttr: string): boolean {
  // 한 셀렉터(= `{` 직전까지) 안에 두 토큰이 같이 나오는지 regex로 스캔
  const re = new RegExp(
    `[^{}]*\\[role="${role}"\\][^{}]*${escapeRegex(stateAttr)}[^{}]*\\{|` +
    `[^{}]*${escapeRegex(stateAttr)}[^{}]*\\[role="${role}"\\][^{}]*\\{`,
    'm',
  )
  if (re.test(css)) return true
  // states/selectors.ts 처럼 role들을 `,`로 나열 후 state attr을 뒤에 붙이는 패턴:
  //   `[role="menuitem"], [role="option"], ... { ... }` 는 role만 있고 state 없음
  //   `<rovingItem>[aria-selected="true"] { ... }` 처럼 list 전체를 받는 경우 → role 하나씩 치환
  return false
}

// 일반화된 공통 state 검사: selectors.ts의 rovingItem이 state 전역 규칙으로 쓰이는 경우를
// 포착하기 위해, state attr이 rovingItem list( subgridItem / flexItem / rovingItem 명칭 )와
// 함께 나오면 포함된 모든 role에 크레딧을 준다.
const ROVING_LIST_ROLES = ['menuitem','menuitemcheckbox','menuitemradio','option','treeitem','tab']

function hasStateOnRovingList(stateAttr: string): boolean {
  // `<list>[state]` 혹은 `<list>:state` 패턴. list 자체는 문자열 치환되어 CSS에 펼쳐져 있으므로
  // 셀렉터 안에 rovingItem 구성 role들(menuitem + option + treeitem + tab 등 여러 개)이
  // 함께 등장하고, state도 붙어있는지 본다.
  const re = new RegExp(
    `[^{}]*\\[role="menuitem"\\][^{}]*\\[role="option"\\][^{}]*${escapeRegex(stateAttr)}[^{}]*\\{|` +
    `[^{}]*${escapeRegex(stateAttr)}[^{}]*\\[role="menuitem"\\][^{}]*\\[role="option"\\][^{}]*\\{`,
    'm',
  )
  return re.test(css)
}

function escapeRegex(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

// ---------- 실행 ----------
type Finding = { role: string; present: boolean; emitted: boolean; viaNative: boolean; missing: Req[]; covered: Req[] }

// ui/ emit된 role이지만 매트릭스에 없는 것도 감사 대상으로 자동 추가 (state 요구사항은 없음)
for (const role of emittedRoles) if (!(role in ROLE_MATRIX)) (ROLE_MATRIX as Record<string, { states: Req[] }>)[role] = { states: [] }

const findings: Finding[] = []
for (const [role, def] of Object.entries(ROLE_MATRIX)) {
  const emitted = emittedRoles.has(role)
  const hasRoleSel = css.includes(`[role="${role}"]`)
  const native = NATIVE_FALLBACK[role]
  const viaNative = !hasRoleSel && !!native && css.includes(native)
  const present = hasRoleSel || viaNative
  // 네이티브로 처리되는 role은 값/상태를 UA가 그리므로 state 요구를 면제
  const states = viaNative ? [] : [...def.states, ...(ROVING_ROLES.has(role) ? COMMON : [])]
  const covered: Req[] = []
  const missing: Req[] = []
  for (const s of states) {
    const direct = hasRoleWithState(role, s.attr)
    const viaList = ROVING_LIST_ROLES.includes(role) && hasStateOnRovingList(s.attr)
    // :focus-visible은 대부분 control 전역 규칙이라 별도 처리
    const viaControl = s.attr === ':focus-visible' && /button,\s*\[role="button"\][^{}]*:focus-visible|:focus-visible[^{}]*button/.test(css)
    ;(direct || viaList || viaControl ? covered : missing).push(s)
  }
  findings.push({ role, present, emitted, viaNative, missing, covered })
}

// ---------- 리포트 ----------
const pad = (s: string, n: number) => s + ' '.repeat(Math.max(0, n - s.length))

let totalReq = 0, totalCov = 0
const gaps: Finding[] = [] // ui/ emit되는데 CSS 없음 — 절대 있으면 안 되는 구멍
console.log('role × CSS 커버리지 감사\n')
console.log(pad('role', 20) + pad('emit', 6) + pad('css', 8) + pad('covered', 10) + 'notes / missing')
console.log('─'.repeat(90))
for (const f of findings) {
  const req = f.covered.length + f.missing.length
  totalReq += req
  totalCov += f.covered.length
  const emitMark = f.emitted ? '✅' : '·'
  const cssMark = f.present ? (f.viaNative ? '⚙️ native' : '✅') : (f.emitted ? '🚨 GAP' : '—')
  if (f.emitted && !f.present) gaps.push(f)
  const cov = req === 0 ? '—' : `${f.covered.length}/${req}`
  const miss = f.missing.length === 0 ? '' : f.missing.map((m) => m.attr).join(' , ')
  console.log(pad(f.role, 20) + pad(emitMark, 6) + pad(cssMark, 10) + pad(cov, 10) + miss)
}

console.log('\n상세(미커버)')
for (const f of findings) {
  if (f.missing.length === 0) continue
  console.log(`\n  ${f.role}`)
  for (const m of f.missing) {
    console.log(`    ✗ ${pad(m.attr, 28)} ${m.desc}`)
  }
}

if (gaps.length > 0) {
  console.log('\n🚨 ui/가 emit하는데 ds.css에 셀렉터 없음 — 반드시 메워야 함')
  for (const f of gaps) {
    const files = [...new Set(emitters[f.role] ?? [])].slice(0, 3).join(', ')
    console.log(`  [role="${f.role}"]  ← ${files}`)
  }
}

console.log('\n' + '─'.repeat(90))
const pct = totalReq === 0 ? 100 : Math.round((totalCov / totalReq) * 100)
const cssCount = findings.filter((f) => f.present).length
console.log(`요약 — role CSS: ${cssCount}/${findings.length}   state: ${totalCov}/${totalReq} (${pct}%)   🚨 GAP: ${gaps.length}`)

process.exit(gaps.length > 0 || totalCov < totalReq ? 1 : 0)

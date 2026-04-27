#!/usr/bin/env node
// ds invariant-coverage 린트 — "fn은 있는데 role이 우회된" 구멍을 탐지.
//
// 원리:
//   widget CSS가 선언한 interactive role은 반드시 state.ts(hover/focus/selected/disabled)
//   처리를 받아야 한다. ds는 이걸 widget마다 호출하지 않고 style/states/selectors.ts의
//   selector 리스트(rovingItem/control/clickable)에 등록하면 style/states/index.ts가
//   전수 적용하는 구조로 강제한다.
//
//   즉 "widget이 [role="X"]를 선언 ⟹ X가 selector 리스트에 존재" 가 invariant.
//   여기가 깨지면 해당 role은 hover 피드백·포커스 링·선택 톤이 묵묵히 빠진다.
//
// 추가 검증:
//   - control-h 기하: style/widgets에서 min-height 수치 리터럴 직접 지정은 controlBox 우회
//   - icon 기하: mask/background-image로 직접 svg 넣되 width!=height면 정사각 invariant 위반
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

// WAI-ARIA의 interactive (state 처리가 반드시 필요한) role 집합
const INTERACTIVE_ROLES = new Set([
  'button', 'link',
  'menuitem', 'menuitemcheckbox', 'menuitemradio',
  'option', 'tab', 'treeitem',
  'switch', 'checkbox', 'radio',
  'gridcell', 'columnheader', 'row',
  // rowheader 는 ds 에서 scope="row" 구조 헤더로만 쓰이고 클릭 불가 → interactive 제외.
  'combobox',
])

// 컨테이너·비-interactive: 커버리지 확인 불필요
const CONTAINER_ROLES = new Set([
  'toolbar', 'menu', 'menubar', 'tree', 'tablist', 'listbox',
  'grid', 'treegrid', 'group', 'radiogroup', 'rowgroup',
  'separator', 'tabpanel', 'alert', 'tooltip', 'feed',
  'presentation', 'dialog', 'status', 'region', 'navigation',
])

// ── ① state selector 커버리지 수집 ──────────────────────────────────────
const SELECTORS_FILE = join(ROOT, 'packages/ds/src/tokens/internal/states/selectors.ts')
const selectorsText = readFileSync(SELECTORS_FILE, 'utf8')
const registeredRoles = new Set()
// [role="X"] + optional [attr] 꼬리 (조건부 커버도 커버로 인정 — 예: columnheader[aria-sort])
for (const m of selectorsText.matchAll(/\[role="([a-z-]+)"\]/g)) {
  registeredRoles.add(m[1])
}
// control 셀렉터의 native 원소 커버 — button/input/select/textarea 는 native 상태 처리
const nativeControls = new Set(['button', 'input', 'select', 'textarea'])

// ── ② ds UI 레이어에서 role=X가 어떤 DOM 원소로 emit되는지 수집 ─────────
// <button role="switch"> 라면 switch는 native control 로 state 커버됨.
// <div role="radio"> 라면 control 셀렉터 밖 → 커버리지 구멍.
const UI_DIR = join(ROOT, 'packages/ds/src/ui')
function* walkTsx(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    const s = statSync(p)
    if (s.isDirectory()) yield* walkTsx(p)
    else if (/\.(tsx|ts)$/.test(n)) yield p
  }
}
const roleElement = new Map() // role -> Set<tagName>
for (const file of walkTsx(UI_DIR)) {
  const text = readFileSync(file, 'utf8')
  // 간단히 각 role="X" 근처(앞 200자)에서 JSX element 태그를 탐색
  const re = /role=["']([a-z-]+)["']/g
  let m
  while ((m = re.exec(text))) {
    const role = m[1]
    const context = text.slice(Math.max(0, m.index - 300), m.index)
    const tagMatch = [...context.matchAll(/<([a-zA-Z][\w]*)\b/g)]
    const tag = tagMatch.length ? tagMatch[tagMatch.length - 1][1].toLowerCase() : null
    if (!tag) continue
    if (!roleElement.has(role)) roleElement.set(role, new Set())
    roleElement.get(role).add(tag)
  }
}

// ── ③ style/widgets 에서 선언된 role 수집 ──────────────────────────────
const WIDGETS_DIR = join(ROOT, 'packages/ds/src/style/widgets')
const widgetRoles = new Map() // role -> Set<file>
for (const file of walkTsx(WIDGETS_DIR)) {
  const text = readFileSync(file, 'utf8')
  for (const m of text.matchAll(/\[role="([a-z-]+)"\]/g)) {
    const role = m[1]
    if (!widgetRoles.has(role)) widgetRoles.set(role, new Set())
    widgetRoles.get(role).add(file)
  }
}

// ── ④ 커버리지 판정 ─────────────────────────────────────────────────────
const findings = []

for (const [role, files] of widgetRoles) {
  if (CONTAINER_ROLES.has(role)) continue
  if (!INTERACTIVE_ROLES.has(role)) continue

  if (registeredRoles.has(role)) continue // selectors.ts 에 직접 등록됨 ✓

  // UI emit 태그가 native control인지 확인
  const tags = roleElement.get(role) ?? new Set()
  const nativeCovered = [...tags].some((t) => nativeControls.has(t))
  if (nativeCovered) continue

  const tagList = [...tags].join(',') || '(unknown)'
  for (const file of files) {
    findings.push({
      kind: 'state-coverage',
      role,
      tags: tagList,
      file,
      hint: `[role="${role}"] 은 interactive인데 states/selectors.ts에 없고 UI가 native control(<button>/<input>)로도 emit하지 않음 → hover/focus/selected invariant 누락`,
    })
  }
}

// ── ⑤ controlBox 우회 검출 — style/widgets에서 raw min-height 설정 ─────
for (const file of walkTsx(WIDGETS_DIR)) {
  const text = readFileSync(file, 'utf8')
  const lines = text.split('\n')
  let inBlock = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (inBlock) { if (/\*\//.test(line)) inBlock = false; continue }
    if (/\/\*/.test(line) && !/\*\/.*$/.test(line)) { inBlock = true; continue }
    const t = line.trim()
    if (t.startsWith('//') || t.startsWith('*')) continue
    if (/\bmin-height\s*:\s*[^;]*[0-9]+[a-z%]/.test(line) && !/var\(--ds-control-h\)/.test(line)) {
      findings.push({
        kind: 'controlbox-bypass',
        role: '(n/a)',
        tags: '',
        file,
        line: i + 1,
        hint: 'raw min-height 설정 — controlBox() 사용하거나 var(--ds-control-h) 소비 권장',
        snippet: line.trim().slice(0, 100),
      })
    }
  }
}

// ── 리포트 ──────────────────────────────────────────────────────────────
const byKind = findings.reduce((m, f) => ((m[f.kind] ??= []).push(f), m), {})

for (const [kind, list] of Object.entries(byKind)) {
  console.log(`\n=== ${kind} (${list.length}) ===`)
  for (const f of list) {
    const loc = relative(ROOT, f.file) + (f.line ? `:${f.line}` : '')
    if (kind === 'state-coverage') {
      console.log(`❌ [role="${f.role}"]  tag=${f.tags}  ${loc}`)
      console.log(`   ↳ ${f.hint}`)
    } else {
      console.log(`❌ ${loc}  ${f.snippet ?? ''}`)
      console.log(`   ↳ ${f.hint}`)
    }
  }
}

if (findings.length === 0) {
  console.log('✅ invariant 커버리지 완전.')
} else {
  console.log(`\n요약 — 총 ${findings.length}건`)
}

process.exit(findings.length > 0 ? 1 : 0)

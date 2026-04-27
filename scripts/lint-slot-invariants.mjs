#!/usr/bin/env node
/**
 * slot/* role-based spacing invariant lint.
 *
 * 원칙: slot.* 토큰들 사이의 *위계* 가 자기모순이면 안 된다.
 *   - 컨테이너 padding 은 그 안 item padding 보다 작지 않다.
 *   - modal weight 단조: tooltip < popover ≤ sheet ≤ dialog
 *   - focus 카드(auth) 는 일반 카드(card) 보다 큰 호흡
 *   - 정의했는데 widget 어디서도 안 쓰는 dead slot 금지
 *   - 모든 값은 pad(N) scale 위에 있다 (raw px 금지)
 *
 * source-of-truth: packages/ds/src/tokens/foundations/spacing/slot.ts
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SLOT_FILE = join(ROOT, 'packages/ds/src/tokens/foundations/spacing/slot.ts')

// ── parse ────────────────────────────────────────────────────────────────
// slot 객체에서 { component: { key: pad(N) } } 형태로 추출.
// 단일 출처라 정규식 파싱이 충분 — JSON5/AST 안 씀.
function parseSlot(text) {
  const slots = {}
  // match lines like:  card:    { pad: pad(2), gap: pad(1.5), ... },
  const lineRe = /^\s*(\w+):\s*\{([^}]+)\}/gm
  let m
  while ((m = lineRe.exec(text))) {
    const comp = m[1]
    if (comp === 'slot') continue
    const body = m[2]
    const fields = {}
    const fieldRe = /(\w+):\s*pad\(([0-9.]+)\)/g
    let f
    while ((f = fieldRe.exec(body))) fields[f[1]] = parseFloat(f[2])
    if (Object.keys(fields).length) slots[comp] = fields
  }
  return slots
}

const SLOT_TEXT = readFileSync(SLOT_FILE, 'utf8')
const S = parseSlot(SLOT_TEXT)

// ── invariants ───────────────────────────────────────────────────────────
const findings = []
const ok = []

const get = (path) => {
  const [comp, key] = path.split('.')
  return S[comp]?.[key]
}

const cmp = (a, op, b, msg) => {
  const A = get(a), B = get(b)
  if (A === undefined || B === undefined) {
    findings.push({ kind: 'missing', msg: `${msg} — ${a}=${A} ${b}=${B}` })
    return
  }
  const pass = op === '>=' ? A >= B
            : op === '>'  ? A > B
            : op === '<'  ? A < B
            : op === '<=' ? A <= B
            : false
  if (pass) ok.push(`${msg}  (${a}=${A} ${op} ${b}=${B})`)
  else findings.push({ kind: 'invariant', msg: `${msg}  (${a}=${A} ${op} ${b}=${B} 위반)` })
}

// 1. Container ≥ Item — 컨테이너가 item 보다 작거나 같으면 시각 위계 깨짐
cmp('sidebar.pad', '>=', 'sidebar.itemPadY', '[Container ⊃ Item] sidebar')
cmp('sidebar.pad', '>=', 'sidebar.itemPadX', '[Container ⊃ Item] sidebar (X)')

// 2. Modal weight 단조 — focus 강도 순
cmp('popover.pad', '>',  'tooltip.pad',     '[Modal 단조] tooltip < popover')
cmp('sheet.pad',   '>=', 'popover.pad',     '[Modal 단조] popover ≤ sheet')
cmp('dialog.pad',  '>=', 'sheet.pad',       '[Modal 단조] sheet ≤ dialog')

// 3. Focus 카드 우선 — auth 가 일반 카드보다 큰 호흡
cmp('auth.pad', '>', 'card.pad', '[Focus 우선] card.pad < auth.pad')
cmp('auth.slotGap', '<=', 'auth.pad', '[Auth 자기내] slotGap ≤ pad')
cmp('auth.formGap', '<=', 'auth.slotGap', '[Auth 자기내] formGap ≤ slotGap')

// 4. mark — inline 컴포넌트, gap < padX (시각적으로 가로 정렬)
cmp('mark.padX', '>=', 'mark.gap', '[Mark] padX ≥ gap')

// 5. details — summary 가 본문 padding 보다 작거나 같음 (header 가 더 좁아야 자연)
cmp('details.pad', '>=', 'details.summaryPadY', '[Details] body pad ≥ summaryPadY')

// ── dead slot 검출 ───────────────────────────────────────────────────────
const SCAN_DIRS = [
  'packages/ds/src/style/widgets',
  'packages/ds/src/tokens/style/shell',
]
function* walk(p) {
  for (const name of readdirSync(p)) {
    const full = join(p, name)
    const st = statSync(full)
    if (st.isDirectory()) yield* walk(full)
    else if (/\.(ts|tsx)$/.test(name)) yield full
  }
}
const widgetText = SCAN_DIRS.flatMap((d) => {
  const full = join(ROOT, d)
  try { statSync(full) } catch { return [] }
  return [...walk(full)].map((f) => readFileSync(f, 'utf8'))
}).join('\n')

for (const [comp, fields] of Object.entries(S)) {
  for (const key of Object.keys(fields)) {
    const ref = `slot.${comp}.${key}`
    if (!widgetText.includes(ref)) {
      findings.push({ kind: 'dead', msg: `[Dead slot] ${ref} — widget 어디서도 안 쓰임 (정의만 있고 소비처 0)` })
    } else {
      ok.push(`[Live] ${ref}`)
    }
  }
}

// ── raw spacing audit (pad/gap/margin/inset 통합) ────────────────────────
// slot 으로 일반화 가능한데도 raw pad(N) 으로 적힌 자리.
// pad·gap·margin·inset 은 CSS property 가 달라도 같은 spacing family 로 본다.
const SPACING_PROP = /(padding|gap|margin|inset|column-gap|row-gap)[a-z-]*\s*:\s*[^;]*pad\(/g
let widgetRawCount = 0
const widgetRawByProp = {}
for (const d of SCAN_DIRS) {
  const full = join(ROOT, d)
  try { statSync(full) } catch { continue }
  for (const f of walk(full)) {
    const text = readFileSync(f, 'utf8')
    for (const m of text.matchAll(SPACING_PROP)) {
      const prop = m[1].split('-')[0]
      widgetRawByProp[prop] = (widgetRawByProp[prop] ?? 0) + 1
      widgetRawCount++
    }
  }
}

// ── report ───────────────────────────────────────────────────────────────
const errors = findings.filter((f) => f.kind === 'invariant' || f.kind === 'missing')
const warnings = findings.filter((f) => f.kind === 'dead')

if (errors.length === 0 && warnings.length === 0) {
  console.log(`✅ slot invariants — 모두 통과 (${ok.length}건)`)
} else {
  for (const f of errors)   console.log(`❌ ${f.msg}`)
  for (const f of warnings) console.log(`⚠️  ${f.msg}`)
  console.log()
  console.log(`invariant — ✅ ${ok.length}건  ❌ ${errors.length}건  ⚠️ dead ${warnings.length}건`)
}

// raw spacing 통합 dashboard — pad/gap/margin 같이 본다.
console.log()
const propsLine = Object.entries(widgetRawByProp)
  .sort(([, a], [, b]) => b - a)
  .map(([k, v]) => `${k}:${v}`)
  .join('  ')
console.log(`raw spacing in widgets — ${widgetRawCount}건  (${propsLine})`)
console.log(`  ↳ slot.* 으로 일반화 가능한 자리 — 점진 마이그레이션 대상`)

process.exit(errors.length > 0 ? 1 : 0)

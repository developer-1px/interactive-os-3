#!/usr/bin/env tsx
/**
 * dsCss 감사 — packages/ds/src/style/** 의 css 템플릿 리터럴을 추출해
 * 중복 selector / 중복 declaration block / 깊은 descendant chain 을 보고.
 *
 * 외부 추상 도입 없이 기존 단일-stylesheet 구조를 그대로 입력으로 삼는다.
 * (role-css-audit.ts 와 동일한 정적 스캔 패턴 — vite import.meta.glob 의존을 우회)
 *
 * ${...} 보간은 placeholder 로 마스킹 — 토큰 호출(pad/radius 등)은 본문 중복 비교 시
 * 동일 호출이면 동일 마스킹으로 정규화되어 감지된다.
 *
 * 사용:  pnpm audit:ds-css
 * exit:  0 깨끗 / 1 항목 발견
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import {
  parseRules as sharedParseRules,
  normSelector,
  splitSelectorList,
  normDecls,
  depthOf,
  type Rule as SharedRule,
} from '../packages/ds/src/style/audit'

const ROOT = new URL('..', import.meta.url).pathname
const STYLE_ROOT = join(ROOT, 'packages/ds/src/style')

type Rule = SharedRule & { file: string }

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (/\.ts$/.test(name)) out.push(p)
  }
  return out
}

// ── extract css`...` blocks per file ───────────────────────────────────
function extractCssBlocks(src: string): string[] {
  const out: string[] = []
  const re = /\bcss`/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    const start = m.index + m[0].length
    let i = start
    let depth = 0 // ${...} depth
    while (i < src.length) {
      const c = src[i]
      if (c === '\\') { i += 2; continue }
      if (c === '$' && src[i + 1] === '{') { depth++; i += 2; continue }
      if (c === '}' && depth > 0) { depth--; i++; continue }
      if (c === '`' && depth === 0) break
      i++
    }
    out.push(src.slice(start, i))
    re.lastIndex = i + 1
  }
  return out
}

// ${...} → __ph_<sluggedExpr>__  (식별자형이라 stripComments / brace balance 영향 없음)
function maskInterp(s: string): string {
  let out = ''
  let i = 0
  while (i < s.length) {
    if (s[i] === '$' && s[i + 1] === '{') {
      let depth = 1
      i += 2
      const start = i
      while (i < s.length && depth > 0) {
        if (s[i] === '{') depth++
        else if (s[i] === '}') depth--
        if (depth > 0) i++
      }
      const expr = s.slice(start, i).trim().replace(/\s+/g, ' ')
      const slug = expr.replace(/[^A-Za-z0-9]/g, '_').slice(0, 40)
      out += `__ph_${slug}__`
      i++
    } else {
      out += s[i++]
    }
  }
  return out
}

// ── run ────────────────────────────────────────────────────────────────
const files = walk(STYLE_ROOT)
const rules: Rule[] = []
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const blocks = extractCssBlocks(src)
  for (const b of blocks) {
    for (const r of sharedParseRules(maskInterp(b))) {
      rules.push({ ...r, file: relative(ROOT, file) })
    }
  }
}

const bySelector = new Map<string, Rule[]>()
const byBody = new Map<string, Rule[]>()
const deepSelectors: { sel: string; depth: number; file: string }[] = []
const DEPTH_THRESHOLD = 4

for (const r of rules) {
  const sel = normSelector(r.selector)
  const a = bySelector.get(sel) ?? []
  a.push(r)
  bySelector.set(sel, a)

  const decls = normDecls(r.body)
  if (decls.length > 0) {
    const b = byBody.get(decls) ?? []
    b.push(r)
    byBody.set(decls, b)
  }
  for (const single of splitSelectorList(sel)) {
    const d = depthOf(single)
    if (d > DEPTH_THRESHOLD) deepSelectors.push({ sel: single, depth: d, file: r.file })
  }
}

// ── report ─────────────────────────────────────────────────────────────
let issues = 0
const trim = (s: string, n = 110) => (s.length > n ? s.slice(0, n) + '…' : s)

// :root / html / body / * 같은 globals 는 토큰을 여러 파일에서 추가하는 정상 패턴 — 보고 제외.
const ALWAYS_ALLOWED = new Set(['*', ':root', 'html', 'body'])

const dupSel = [...bySelector.entries()].filter(([sel, rs]) => {
  if (rs.length < 2) return false
  if (ALWAYS_ALLOWED.has(sel)) return false
  // 같은 파일에서의 의도된 분할은 노이즈이므로 cross-file 만 본다
  const files = new Set(rs.map((r) => r.file))
  return files.size > 1 || rs.length > 2
})
if (dupSel.length) {
  issues += dupSel.length
  console.log(`\n🔁 duplicate selector list (${dupSel.length})`)
  console.log(`   같은 selector 가 여러 곳에서 다시 선언됨 — 통합 또는 cascade race 점검.\n`)
  for (const [sel, rs] of dupSel.slice(0, 25)) {
    const files = [...new Set(rs.map((r) => r.file))]
    console.log(`   • ${trim(sel)}  (×${rs.length})`)
    for (const f of files) console.log(`       ${f}`)
  }
  if (dupSel.length > 25) console.log(`   …외 ${dupSel.length - 25}건`)
}

const dupBody = [...byBody.entries()].filter(([k, rs]) => {
  if (rs.length < 2) return false
  if (k.split(';').length < 2) return false // 1-prop 블록은 노이즈
  const sels = new Set(rs.map((r) => normSelector(r.selector)))
  return sels.size > 1 // 같은 selector 의 같은 본문은 위 dupSel 에서 잡힘
})
if (dupBody.length) {
  issues += dupBody.length
  console.log(`\n♊ duplicate declaration block (${dupBody.length})`)
  console.log(`   서로 다른 selector 가 동일한 선언 묶음 — 공통 helper / token 추출 후보.\n`)
  for (const [body, rs] of dupBody.slice(0, 20)) {
    console.log(`   • { ${trim(body, 90)} }`)
    for (const r of rs.slice(0, 4)) console.log(`     ↳ ${trim(r.selector.split(',')[0].trim(), 60)}   (${r.file})`)
    if (rs.length > 4) console.log(`     …+${rs.length - 4}`)
  }
  if (dupBody.length > 20) console.log(`   …외 ${dupBody.length - 20}건`)
}

if (deepSelectors.length) {
  issues += deepSelectors.length
  console.log(`\n🪜 deep selector (depth > ${DEPTH_THRESHOLD}) — ${deepSelectors.length}건`)
  console.log(`   descendant chain 이 임계값을 넘음 — role 분리 또는 직접 wrapping 고려.\n`)
  for (const { sel, depth, file } of deepSelectors.slice(0, 20)) {
    console.log(`   • [d=${depth}] ${trim(sel)}   (${file})`)
  }
  if (deepSelectors.length > 20) console.log(`   …외 ${deepSelectors.length - 20}건`)
}

console.log(`\n— scanned ${files.length} files · ${rules.length} rules · 이슈 ${issues}건 —\n`)
process.exit(issues > 0 ? 1 : 0)

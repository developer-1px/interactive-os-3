#!/usr/bin/env node
/**
 * audit-hmi — Hierarchy Monotonicity Invariant 정적 검사.
 *
 * 목적: prose 등 컨테이너의 CSS 규칙에서 selector depth 별 분리 강도(sep) 를
 *       추출하고 "자손 그룹의 sep ≤ 조상 그룹의 sep" 단조성 위반을 보고.
 *
 * 입력: packages/ds/src/style/widgets/pattern/prose.ts (또는 인자로 지정)
 * 출력: 위반 목록 + 점수 표
 *
 * 점수 채널:
 *   gap   = proximity('X') 또는 직접 em 값
 *   border = px 너비
 *   surfaceJump = bg 변화 (단순화: codeSurface/toneTint 등장 = 0.5~1.0)
 *
 * 한계:
 *   - 정적 분석이라 실제 cascade 결과가 아닌 "선언된 의도" 만 점수화.
 *   - margin collapse 미반영. border collapse 미반영.
 *   - 우선 prose 검증으로 시작 → 다른 widget 으로 확장.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const PROXIMITY_SCORE = {
  bonded: 0.25,
  related: 0.5,
  sibling: 1.0,
  group: 1.5,
  section: 2.0,
  major: 3.0,
  page: 4.0,
}

function borderScore(px) {
  if (px <= 0) return 0
  if (px <= 1) return 0.3
  if (px <= 2) return 0.5
  if (px <= 3) return 0.65
  return Math.min(1.0, 0.65 + (px - 3) * 0.1)
}

// CSS rule 추출 (간이 파서 — at-rule body 한 단 더 들어감)
function stripComments(s) { return s.replace(/\/\*[\s\S]*?\*\//g, '') }

function parseRules(src) {
  src = stripComments(src)
  const out = []
  let buf = ''
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '{') {
      const sel = buf.trim()
      buf = ''
      let depth = 1
      i++
      const start = i
      while (i < src.length && depth > 0) {
        if (src[i] === '{') depth++
        else if (src[i] === '}') depth--
        if (depth > 0) i++
      }
      const body = src.slice(start, i)
      i++
      if (sel.startsWith('@layer') || sel.startsWith('@media') || sel.startsWith('@container') || sel.startsWith('@supports') || sel.startsWith('@scope')) {
        for (const r of parseRules(body)) out.push(r)
      } else if (sel.length > 0 && !sel.startsWith('@')) {
        out.push({ sel, body })
      }
    } else {
      buf += c
      i++
    }
  }
  return out
}

// selector depth — descendant combinators 카운트 (간이)
function selectorDepth(sel) {
  // 콤마로 분리된 selector list 면 첫 부분만
  const first = sel.split(',')[0].trim()
  // [data-flow="prose"] 자체는 depth 0 의 컨테이너로 간주
  // 그 뒤로 descendant 마다 +1
  const tokens = first.split(/\s+(?![^\[]*\])/).filter(Boolean)
  return Math.max(0, tokens.length - 1)
}

// body 에서 sep score 추출
function scoreBody(body) {
  let gap = 0
  let border = 0

  // proximity('X') → em 값
  const proxMatches = [...body.matchAll(/proximity\(['"]?(\w+)['"]?\)/g)]
  for (const m of proxMatches) {
    const tier = m[1]
    if (tier in PROXIMITY_SCORE) gap = Math.max(gap, PROXIMITY_SCORE[tier])
  }

  // 직접 em 값 (margin-block-start: 1.5em 같은)
  const emMatches = [...body.matchAll(/margin-block-start:\s*([\d.]+)em/g)]
  for (const m of emMatches) {
    gap = Math.max(gap, parseFloat(m[1]))
  }

  // border-block / border-inline / border:
  const borderMatches = [...body.matchAll(/border(?:-block|-inline)?(?:-start|-end)?:\s*([\d.]+)px/g)]
  for (const m of borderMatches) {
    border = Math.max(border, parseFloat(m[1]))
  }

  // hairlineWidth() — 1px equivalent
  if (/hairlineWidth\(\)/.test(body)) border = Math.max(border, 1)

  return { gap, border, score: gap + borderScore(border) }
}

function main() {
  const file = process.argv[2] || 'packages/ds/src/style/widgets/pattern/prose.ts'
  const path = resolve(process.cwd(), file)
  if (!existsSync(path)) {
    console.error('파일 없음:', path)
    process.exit(1)
  }
  const src = readFileSync(path, 'utf8')

  const rules = parseRules(src)
  // boundary 후보 — margin 또는 border 또는 surface 변경이 있는 rule만
  const scored = rules
    .map(r => ({
      sel: r.sel,
      depth: selectorDepth(r.sel),
      ...scoreBody(r.body),
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => a.depth - b.depth || a.sel.localeCompare(b.sel))

  console.log(`\n# HMI Audit — ${file}\n`)
  console.log('depth | score | sel')
  console.log('------|-------|-----')
  for (const r of scored) {
    console.log(`${r.depth.toString().padStart(5)} | ${r.score.toFixed(2).padStart(5)} | ${r.sel.slice(0, 80)}`)
  }

  // selector 를 element token list 로 분해 (compound 단위 보존)
  const toTokens = sel => sel.split(',')[0].trim().split(/\s+(?![^\[]*\])/).filter(Boolean)
  // descendant 관계 — outer tokens 가 inner tokens 의 prefix(완전 일치 토큰 배열)
  const isDescendantSelector = (outerSel, innerSel) => {
    const ot = toTokens(outerSel)
    const it = toTokens(innerSel)
    if (it.length <= ot.length) return false
    for (let k = 0; k < ot.length; k++) if (ot[k] !== it[k]) return false
    return true
  }

  // HMI 위반 — selector token-prefix 관계에서 자손 score 가 조상 score 초과
  const violations = []
  for (let i = 0; i < scored.length; i++) {
    for (let j = 0; j < scored.length; j++) {
      if (i === j) continue
      const a = scored[i]
      const b = scored[j]
      if (isDescendantSelector(a.sel, b.sel) && b.score > a.score + 1e-9) {
        violations.push({ outer: a, inner: b, delta: b.score - a.score })
      }
    }
  }

  if (violations.length === 0) {
    console.log('\n✅ HMI 위반 없음 — 모든 자손이 조상보다 약하거나 같은 분리 강도.\n')
    process.exit(0)
  } else {
    console.log(`\n🔴 HMI 위반 ${violations.length}건:\n`)
    for (const v of violations.slice(0, 20)) {
      console.log(`  +${v.delta.toFixed(2)}점 — outer ${v.outer.score.toFixed(2)} (depth ${v.outer.depth}) < inner ${v.inner.score.toFixed(2)} (depth ${v.inner.depth})`)
      console.log(`    outer: ${v.outer.sel.slice(0, 90)}`)
      console.log(`    inner: ${v.inner.sel.slice(0, 90)}`)
    }
    if (violations.length > 20) console.log(`  ... 외 ${violations.length - 20}건`)
    process.exit(1)
  }
}

main()

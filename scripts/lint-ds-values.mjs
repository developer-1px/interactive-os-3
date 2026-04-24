#!/usr/bin/env node
// ds raw-value 린트 — style/widgets, style/shell, style/states 에서 fn/var 우회를 검출한다.
// 원칙: 모든 색·토큰은 fn/palette 또는 var(--ds-*)를 통해야 preset 스왑이 안전하다.
//
// 금지:
//  - #hex 리터럴 (#fff, #ff5f57 등)
//  - 단독 rgb(/rgba(/hsl(/hsla(/oklch(/oklab( — color-mix(in <space>, ...) 내부 interpolation은 제외
//  - border-radius: 999px 류 큰 수치 → radius('pill')
//
// 허용:
//  - var(--ds-*)
//  - color-mix(in oklch|oklab|srgb, ...) — 색공간 지정은 함수 호출이 아님
//  - 1px/2px/3px (hairline·ring 기본 상수)
//  - 파일 전체 주석 · 라인 주석
//
// 정의 소스는 제외:
//  - src/ds/fn/** (토큰 구현체)
//  - src/ds/style/preset/** (preset 원천 정의)
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

// 스캔 범위 (widget/shell/states — 실제 CSS 생성기가 사는 곳)
const SCAN = [
  'src/ds/style/widgets',
  'src/ds/style/shell',
  'src/ds/style/states.ts',
]

// 스킵 (정의 소스)
const SKIP_PATHS = [
  'src/ds/fn',
  'src/ds/style/preset',
]

const ALLOW_COMMENT = (line) => {
  const t = line.trim()
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')
}

// color-mix(in <space>, ...) 내부 color space 키워드는 함수 호출이 아님
const stripColorMixSpace = (line) =>
  line.replace(/color-mix\s*\(\s*in\s+(oklch|oklab|srgb|srgb-linear|lab|lch|hsl|xyz|xyz-d50|xyz-d65|display-p3)\b/gi, 'color-mix(in <space>')

const rules = [
  {
    kind: 'hex',
    hint: '#hex 리터럴 금지 — var(--ds-*) 또는 fn/palette 경유',
    test: (line) => /#[0-9a-fA-F]{3,8}\b/.test(line),
  },
  {
    kind: 'raw-color',
    hint: 'raw 색 함수 금지 — fn/palette의 fg/accent/status/tint/mix/dim 사용',
    test: (line) => {
      const cleaned = stripColorMixSpace(line)
      return /\b(rgb|rgba|hsl|hsla|oklch|oklab)\s*\(/.test(cleaned)
    },
  },
  {
    kind: 'raw-mask',
    hint: 'raw mask/-webkit-mask 금지 — fn/icon의 icon(token, size) 또는 indicator(...) 사용 (icon square invariant)',
    test: (line) => /\b(-webkit-mask|mask)\s*:/.test(line) && !/mask-type|mask-mode|mask-repeat|mask-position|mask-size|mask-origin|mask-clip|mask-composite/.test(line),
  },
  {
    kind: 'radius-literal',
    hint: 'border-radius 리터럴 금지 — radius("sm"|"md"|"lg"|"pill") 사용',
    test: (line) => {
      // border-radius: 4px | 6px | 999px 같은 수치. 0, 50%, 1px~3px 는 허용 (작은 값은 primitive)
      const m = line.match(/border-radius\s*:\s*([^;${]+)/)
      if (!m) return false
      const val = m[1].trim()
      if (val === '0' || val === '0px') return false
      if (/^\d+%/.test(val)) return false  // 50% (circle)
      if (/\$\{/.test(val)) return false   // template expression: ${radius(...)}
      if (/var\(/.test(val)) return false
      if (/^[123]px$/.test(val)) return false // 1px/2px/3px은 primitive 상수 허용
      return /\d/.test(val)
    },
  },
]

function* walk(p) {
  const st = statSync(p)
  if (st.isFile()) {
    if (/\.(ts|tsx)$/.test(p)) yield p
    return
  }
  for (const name of readdirSync(p)) {
    const next = join(p, name)
    if (SKIP_PATHS.some((s) => next.includes(s))) continue
    yield* walk(next)
  }
}

const findings = []
for (const target of SCAN) {
  const full = join(ROOT, target)
  try { statSync(full) } catch { continue }
  for (const file of walk(full)) {
    const text = readFileSync(file, 'utf8')
    // 블록 주석 제거 후 라인 스캔 — 주석 안의 위반은 무시
    const lines = text.split('\n')
    let inBlock = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (inBlock) {
        if (/\*\//.test(line)) inBlock = false
        continue
      }
      if (/\/\*/.test(line) && !/\*\/.*$/.test(line)) { inBlock = true; continue }
      if (ALLOW_COMMENT(line)) continue
      for (const r of rules) {
        if (r.test(line)) {
          findings.push({ kind: r.kind, file, ln: i + 1, hint: r.hint, snippet: line.trim().slice(0, 100) })
        }
      }
    }
  }
}

for (const f of findings) {
  const loc = `${relative(ROOT, f.file)}:${f.ln}`.padEnd(56)
  console.log(`❌ ${f.kind.padEnd(14)}  ${loc}  ${f.hint}`)
  console.log(`   ↳ ${f.snippet}`)
}

if (findings.length === 0) {
  console.log('✅ raw-value 위반 없음.')
} else {
  console.log()
  const byKind = findings.reduce((m, f) => ((m[f.kind] = (m[f.kind] ?? 0) + 1), m), {})
  const parts = Object.entries(byKind).map(([k, n]) => `${k}:${n}`).join('  ')
  console.log(`요약 — 총 ${findings.length}건  (${parts})`)
}

process.exit(findings.length > 0 ? 1 : 0)

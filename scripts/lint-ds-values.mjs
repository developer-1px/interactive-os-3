#!/usr/bin/env node
// ds raw-value 린트 — style/widgets, style/shell, style/states 에서 fn/var 우회를 검출한다.
// 원칙: 모든 색·토큰은 fn/palette 또는 var(--ds-*)를 통해야 preset 스왑이 안전하다.
//
// 룰 정의는 scripts/lib/ds-value-rules.mjs — Write/Edit hook(guard-style-values.mjs)도 같은 룰 사용.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { scanText } from './lib/ds-value-rules.mjs'

const ROOT = new URL('..', import.meta.url).pathname

// Convention discovery — 새 패키지·앱·showcase 추가 시 SCAN 배열 수정 없이 자동
// 포함된다 (OCP). 포함 규칙:
//   1. SOURCE_ROOTS 아래를 모두 walk
//   2. SCOPE 필터 통과 (.style.ts / /style/ 경로 / states.ts) — widget 시각 코드만
//   3. SKIP_PATHS 에 걸리면 제외 (정의 layer · 물리 chrome · _demos)
//
// 즉 widget 시각 코드는 *어디 있든* lint 대상. raw 색을 칠하면 잡힌다.
const SOURCE_ROOTS = ['packages', 'showcase', 'apps']

const SKIP_PATHS = [
  'node_modules',
  'dist',
  // 정의 layer — raw neutral/hex 가 SSOT 라 정당
  'packages/ds/src/fn',
  'packages/ds/src/tokens/internal/preset',
  'packages/ds/src/tokens/foundations',
  // demo는 1회용 시연 — raw 허용
  '/_demos/',
  // devices/ 는 physical chrome (bezel·notch 같은 물리 수치) — semantic role 부적합
  '/devices/',
  // theme creator — palette 편집 도구라 raw scale 직접 read/write 정당 (다른 카탈로그 라우트와 동일 예외)
  '/showcase/theme/',
]

// scope: 시각 코드만 — *.tsx component 는 제외.
//   - <Name>.style.ts / <Name>.styles.ts (sibling pattern)
//   - /style/<foo>.ts  (style 폴더 내부)
//   - style.ts / styles.ts (단일 시각 모듈)
//   - states.ts (canvas 등에서 시각 상태 토큰 호출하는 곳)
const SCOPE = (p) =>
  /\.(style|styles)\.ts$/.test(p) ||
  p.includes('/style/') ||
  /\/(style|styles)\.ts$/.test(p) ||
  p.endsWith('/states.ts')

function* walk(p) {
  const st = statSync(p)
  if (st.isFile()) {
    if (/\.(ts|tsx)$/.test(p) && SCOPE(p)) yield p
    return
  }
  for (const name of readdirSync(p)) {
    const next = join(p, name)
    if (SKIP_PATHS.some((s) => next.includes(s))) continue
    yield* walk(next)
  }
}

const findings = []
for (const root of SOURCE_ROOTS) {
  const full = join(ROOT, root)
  try { statSync(full) } catch { continue }
  for (const file of walk(full)) {
    const text = readFileSync(file, 'utf8')
    for (const f of scanText(text)) findings.push({ ...f, file })
  }
}

const errors = findings.filter((f) => f.level === 'error')
const warnings = findings.filter((f) => f.level === 'warn')

for (const f of errors) {
  const loc = `${relative(ROOT, f.file)}:${f.ln}`.padEnd(56)
  console.log(`❌ ${f.kind.padEnd(20)}  ${loc}  ${f.hint}`)
  console.log(`   ↳ ${f.snippet}`)
}
for (const f of warnings) {
  const loc = `${relative(ROOT, f.file)}:${f.ln}`.padEnd(56)
  console.log(`⚠️  ${f.kind.padEnd(20)}  ${loc}  ${f.hint}`)
  console.log(`   ↳ ${f.snippet}`)
}

if (findings.length === 0) {
  console.log('✅ raw-value 위반 없음.')
} else {
  console.log()
  const summarize = (arr) => {
    const m = arr.reduce((m, f) => ((m[f.kind] = (m[f.kind] ?? 0) + 1), m), {})
    return Object.entries(m).map(([k, n]) => `${k}:${n}`).join('  ')
  }
  if (errors.length) console.log(`❌ errors ${errors.length}건  (${summarize(errors)})`)
  if (warnings.length) console.log(`⚠️  warnings ${warnings.length}건  (${summarize(warnings)})`)
}

process.exit(errors.length > 0 ? 1 : 0)

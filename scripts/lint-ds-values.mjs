#!/usr/bin/env node
// ds raw-value 린트 — style/widgets, style/shell, style/states 에서 fn/var 우회를 검출한다.
// 원칙: 모든 색·토큰은 fn/palette 또는 var(--ds-*)를 통해야 preset 스왑이 안전하다.
//
// 룰 정의는 scripts/lib/ds-value-rules.mjs — Write/Edit hook(guard-style-values.mjs)도 같은 룰 사용.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { scanText } from './lib/ds-value-rules.mjs'

const ROOT = new URL('..', import.meta.url).pathname

const SCAN = [
  'packages/ds/src/style/widgets',
  'packages/ds/src/tokens/style/shell',
  'packages/ds/src/tokens/style/states.ts',
]

const SKIP_PATHS = [
  'packages/ds/src/fn',
  'packages/ds/src/tokens/style/preset',
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
    for (const f of scanText(text)) findings.push({ ...f, file })
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

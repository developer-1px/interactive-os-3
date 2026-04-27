#!/usr/bin/env node
// data-part invariant lint
//
// Invariant:
//   data-part="<name>" 는 namespace selector 일 뿐, 부품 독립 어휘가 아니다.
//   부품의 모든 시각·의미 표현은 ARIA-* 또는 semantic token 으로만 가능해야 한다.
//
// Rules:
//   A) `*.style.ts` 안의 `[data-part="..."]` 셀렉터 — 부품 전용 CSS hook 금지
//   B) `*.tsx` 의 `data-part="<literal>"` — namespace 등장 자체를 baseline 에 잠금
//
// Mode: soft-launch + baseline.
//   현재 위반 = baseline 에 등록된 것만 통과.
//   신규 위반 = exit 1.
//   `--update-baseline` 플래그로 baseline 재생성.
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const BASELINE = join(ROOT, 'scripts/lint-ds-data-part.baseline.json')
const SCAN_DIR = join(ROOT, 'packages/ds/src')

// 정당한 동적 주입 — Renderer 가 `data-part={d.roledescription}` 로 런타임 매핑
const SKIP_FILES = new Set([
  'packages/ds/src/ui/Renderer.tsx',
])

function* walk(p) {
  const st = statSync(p)
  if (st.isFile()) {
    if (/\.(ts|tsx)$/.test(p)) yield p
    return
  }
  for (const name of readdirSync(p)) yield* walk(join(p, name))
}

function scanFile(file, rel) {
  const text = readFileSync(file, 'utf8')
  const isStyle = /\.style\.ts$/.test(file)
  const findings = []
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i]
    // Rule A: style.ts 안 셀렉터
    if (isStyle) {
      const sel = [...ln.matchAll(/\[data-part="([a-z][a-z0-9-]*)"\]/g)]
      for (const m of sel) {
        findings.push({ rule: 'A', file: rel, line: i + 1, name: m[1], snippet: ln.trim() })
      }
    }
    // Rule B: 일반 tsx/ts 의 JSX literal (style.ts 는 A 가 본다)
    if (!isStyle) {
      const lit = [...ln.matchAll(/\bdata-part="([a-z][a-z0-9-]*)"/g)]
      for (const m of lit) {
        findings.push({ rule: 'B', file: rel, line: i + 1, name: m[1], snippet: ln.trim() })
      }
    }
  }
  return findings
}

const all = []
for (const file of walk(SCAN_DIR)) {
  const rel = relative(ROOT, file)
  if (SKIP_FILES.has(rel)) continue
  all.push(...scanFile(file, rel))
}

// signature 는 baseline 비교용 — 줄번호 제외 (코드 이동에 강건)
const sig = (f) => `${f.rule}|${f.file}|${f.name}`

const updateMode = process.argv.includes('--update-baseline')

if (updateMode) {
  const sigs = [...new Set(all.map(sig))].sort()
  writeFileSync(BASELINE, JSON.stringify({ signatures: sigs }, null, 2) + '\n')
  console.log(`✅ baseline 갱신: ${sigs.length} signatures → ${relative(ROOT, BASELINE)}`)
  process.exit(0)
}

const baseline = existsSync(BASELINE)
  ? new Set(JSON.parse(readFileSync(BASELINE, 'utf8')).signatures)
  : new Set()

const newViolations = all.filter((f) => !baseline.has(sig(f)))
const seenSigs = new Set(all.map(sig))
const goneFromBaseline = [...baseline].filter((s) => !seenSigs.has(s))

if (newViolations.length === 0 && goneFromBaseline.length === 0) {
  console.log(`✅ data-part invariant: baseline ${baseline.size}건만 통과, 신규 위반 0건.`)
  process.exit(0)
}

if (newViolations.length > 0) {
  console.log(`❌ data-part 신규 위반 ${newViolations.length}건:\n`)
  for (const f of newViolations) {
    const tag = f.rule === 'A' ? 'style.ts 셀렉터' : 'tsx literal'
    console.log(`  [${f.rule}] ${tag}  ${f.file}:${f.line}  data-part="${f.name}"`)
    console.log(`     ↳ ${f.snippet}`)
  }
  console.log(`\n  Rule A: data-part 는 namespace 만. *.style.ts 안 셀렉터 hook 금지.`)
  console.log(`          표현은 ARIA-* 또는 semantic token 합성으로. 부족하면 토큰 먼저 등록.`)
  console.log(`  Rule B: 새 data-part 이름 도입 금지. 명시 승격이 필요하면 \`--update-baseline\`.`)
}

if (goneFromBaseline.length > 0) {
  console.log(`\nℹ️  baseline 에서 사라진 항목 ${goneFromBaseline.length}건 — \`--update-baseline\` 권장:`)
  for (const s of goneFromBaseline) console.log(`     ${s}`)
}

process.exit(newViolations.length > 0 ? 1 : 0)

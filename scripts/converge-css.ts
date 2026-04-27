#!/usr/bin/env tsx
/**
 * CSS 자가 수렴 루프 — audit-css-decls 가 발견한 raw 누수 중
 * 1:1 토큰 매핑이 확실한 케이스만 codemod 로 흡수한다.
 *
 * 현재 흡수 규칙:
 *   - font-weight: 400 → ${weight('regular')}
 *   - font-weight: 500 → ${weight('medium')}
 *   - font-weight: 600 → ${weight('semibold')}
 *   - font-weight: 700 → ${weight('bold')}
 *   - font-weight: 800 → ${weight('extrabold')}
 *
 * 다른 raw 값(display:flex·margin:0 등)은 mixin 설계가 필요해 자동화 ❌.
 * 새 규칙 추가는 RULES 배열에만 — codemod 본체는 1곳.
 *
 * 사용:  pnpm tsx scripts/converge-css.ts          # dry-run
 *        pnpm tsx scripts/converge-css.ts --apply  # 실제 적용
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = new URL('..', import.meta.url).pathname
const APPLY = process.argv.includes('--apply')

type Rule = { match: RegExp; replace: string; importName: string }

const weightMap: Record<string, string> = {
  '400': 'regular', '500': 'medium', '600': 'semibold', '700': 'bold', '800': 'extrabold',
}
const RULES: Rule[] = [
  ...Object.entries(weightMap).map(([n, name]) => ({
    match: new RegExp(`font-weight:\\s*${n}\\s*;`, 'g'),
    replace: `font-weight: \${weight('${name}')};`,
    importName: 'weight',
  })),
  // 원형/full pill — 50% 금지, pill 토큰으로 통일 (9999px 캡)
  {
    match: /border-radius:\s*(?:50%|9999px|999px)\s*;/g,
    replace: `border-radius: \${radius('pill')};`,
    importName: 'radius',
  },
]

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (/\.ts$/.test(name) && !/\.d\.ts$/.test(name) &&
             (/\.(style|styles)\.ts$/.test(name) || p.includes('/style/'))) out.push(p)
  }
  return out
}

function ensureImport(src: string, name: string): string {
  // import { ... } from '...tokens/foundations...'
  // foundations barrel import — `tokens/foundations` 또는 상대경로 `../foundations` 모두 허용
  const re = /import\s*\{([^}]*)\}\s*from\s*(['"][^'"]*foundations['"])/
  const m = src.match(re)
  if (!m) return src // 알 수 없는 import 패턴 — 손대지 않음
  const names = m[1].split(',').map((s) => s.trim()).filter(Boolean)
  if (names.includes(name)) return src
  names.push(name)
  names.sort()
  return src.replace(re, `import { ${names.join(', ')} } from ${m[2]}`)
}

const files = walk(join(ROOT, 'packages/ds/src'))
let changed = 0
let totalReplacements = 0
const touched: { file: string; n: number }[] = []

for (const file of files) {
  let src = readFileSync(file, 'utf8')
  let n = 0
  const needs = new Set<string>()
  for (const r of RULES) {
    const before = src
    src = src.replace(r.match, () => { n++; return r.replace })
    if (src !== before) needs.add(r.importName)
  }
  if (n === 0) continue
  for (const name of needs) src = ensureImport(src, name)
  if (APPLY) writeFileSync(file, src)
  touched.push({ file: relative(ROOT, file), n })
  changed++
  totalReplacements += n
}

console.log(`\n${APPLY ? '✏️  applied' : '👀 dry-run'} — ${changed} files, ${totalReplacements} replacements\n`)
for (const t of touched) console.log(`   ${String(t.n).padStart(3)}× ${t.file}`)

if (!APPLY) {
  console.log(`\n   --apply 로 실제 적용. 다음 단계:`)
  console.log(`     pnpm tsx scripts/converge-css.ts --apply`)
  console.log(`     npx tsc -b --noEmit`)
  console.log(`     pnpm tsx scripts/audit-css-decls.ts --min=4 --top=10`)
  process.exit(0)
}

// ── re-measure ─────────────────────────────────────────────────────────
console.log(`\n🔍 re-running audit...\n`)
try {
  execSync('npx tsc -b --noEmit', { cwd: ROOT, stdio: 'inherit' })
} catch {
  console.error('❌ tsc 실패 — 수동 확인 필요')
  process.exit(1)
}
execSync('pnpm tsx scripts/audit-css-decls.ts --min=4 --top=10', { cwd: ROOT, stdio: 'inherit' })

#!/usr/bin/env node
// PRD: prd-immutable-anchor.md — Phase 3 codemod
// 외부 deep import 80건을 신경로로 일괄 rewrite.
// alias 호환층 제거 후 build 가 통과하면 alias 룰 제거 가능.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')

// 경로 prefix 매핑 (구 → 신). 더 긴 prefix 가 먼저 매칭되어야 함.
const REWRITES = [
  // L1
  ['@p/ds/foundations/iconography/icon', '@p/ds/tokens/foundations/iconography/icon'],
  ['@p/ds/foundations', '@p/ds/tokens/foundations'],
  ['@p/ds/palette', '@p/ds/tokens/palette'],
  ['@p/ds/style/preset/breakpoints', '@p/ds/tokens/internal/preset/breakpoints'],
  ['@p/ds/style/preset', '@p/ds/tokens/internal/preset'],
  ['@p/ds/style/seed', '@p/ds/tokens/internal/seed'],
  ['@p/ds/style/shell', '@p/ds/tokens/internal/shell'],
  ['@p/ds/style/states', '@p/ds/tokens/internal/states'],
  // L2
  ['@p/ds/core/hooks/useShortcut', '@p/ds/headless/hooks/useShortcut'],
  ['@p/ds/layout/recipes/sidebar', '@p/ds/ui/recipes/sidebar'],
  ['@p/ds/layout/recipes', '@p/ds/ui/recipes'],
  // L3 parts (parts → ui/parts)
  ['@p/ds/parts/Card', '@p/ds/ui/parts/Card'],
  ['@p/ds/parts/Table', '@p/ds/ui/parts/Table'],
  ['@p/ds/parts', '@p/ds/ui/parts'],
  // L3 7-patterns split → content/ + ui/patterns/
  ['@p/ds/ui/7-patterns/ContractCard', '@p/ds/content/ContractCard'],
  ['@p/ds/ui/7-patterns/CourseCard', '@p/ds/content/CourseCard'],
  ['@p/ds/ui/7-patterns/RoleCard', '@p/ds/content/RoleCard'],
  ['@p/ds/ui/7-patterns/ProductCard', '@p/ds/content/ProductCard'],
  ['@p/ds/ui/7-patterns/PostCard', '@p/ds/content/PostCard'],
  ['@p/ds/ui/7-patterns/FeedPost', '@p/ds/content/FeedPost'],
  ['@p/ds/ui/7-patterns', '@p/ds/ui/patterns'],
]
// 더 긴 매칭 우선
REWRITES.sort((a, b) => b[0].length - a[0].length)

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.turbo'])
function* walk(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue
    const full = join(dir, ent.name)
    if (ent.isDirectory()) {
      const rel = relative(REPO_ROOT, full)
      if (rel === 'packages/ds' || rel.startsWith('packages/ds/')) continue
      yield* walk(full)
    } else if (/\.(ts|tsx|mts|cts)$/.test(ent.name)) {
      yield full
    }
  }
}

let changed = 0
let totalReplacements = 0
const dryRun = process.argv.includes('--dry-run')

for (const file of walk(REPO_ROOT)) {
  const before = readFileSync(file, 'utf8')
  let after = before
  for (const [from, to] of REWRITES) {
    // import 또는 export 의 specifier 자리에서만 매칭
    const re = new RegExp(`(from\\s+['"]|import\\s*\\(['"])${escapeReg(from)}(['"]|/)`, 'g')
    after = after.replace(re, (_, lead, tail) => `${lead}${to}${tail}`)
  }
  if (after !== before) {
    const diffCount = (before.match(new RegExp('@p/ds', 'g')) ?? []).length
    changed += 1
    totalReplacements += 1
    if (!dryRun) writeFileSync(file, after)
    console.log(`${dryRun ? '[dry] ' : ''}${relative(REPO_ROOT, file)}`)
  }
}

function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

console.log(`\n${dryRun ? 'DRY RUN — ' : ''}변경된 파일: ${changed}`)

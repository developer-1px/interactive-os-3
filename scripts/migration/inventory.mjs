#!/usr/bin/env node
// PRD: prd-immutable-anchor.md — Phase 0 dry-run 인벤토리
// 외부 deep import 80건이 ds-import-map.ts 의 룰에 100% 매핑되는지 검증한다.
//
// 사용:
//   node scripts/migration/inventory.mjs
//   node scripts/migration/inventory.mjs --verbose   # 매핑 안 된 건 상세 출력

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')

// ds-import-map.ts 의 from 목록만 정규식으로 추출 (런타임 TS 파싱 회피)
const mapSrc = readFileSync(join(__dirname, 'ds-import-map.ts'), 'utf8')
const FROM_PATHS = [
  ...mapSrc.matchAll(/from:\s*'([^']+)'/g),
].map((m) => m[1])

// 재귀 walk — node_modules / .git / packages/ds 제외
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.turbo', '.next'])
function* walk(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue
    const full = join(dir, ent.name)
    if (ent.isDirectory()) {
      // packages/ds 자체 제외
      const rel = relative(REPO_ROOT, full)
      if (rel === 'packages/ds' || rel.startsWith('packages/ds/')) continue
      yield* walk(full)
    } else if (/\.(ts|tsx|mts|cts)$/.test(ent.name)) {
      yield full
    }
  }
}

const IMPORT_RE = /from\s+['"](@p\/ds\/[^'"]+)['"]/g
const lines = []
for (const file of walk(REPO_ROOT)) {
  const content = readFileSync(file, 'utf8')
  let m
  while ((m = IMPORT_RE.exec(content)) !== null) {
    lines.push(`${relative(REPO_ROOT, file)}::${m[1]}`)
  }
}
let matched = 0
let unmatched = []

for (const line of lines) {
  const importPath = line.split('::')[1]
  if (!importPath) continue
  // 가장 긴 prefix 매칭 (정렬: 내림차순)
  const longestFirst = [...FROM_PATHS].sort((a, b) => b.length - a.length)
  const hit = longestFirst.find(
    (p) => importPath === p || importPath.startsWith(p + '/'),
  )
  if (hit) {
    matched += 1
  } else {
    unmatched.push({ line, importPath })
  }
}

const verbose = process.argv.includes('--verbose')

console.log(`총 deep import: ${lines.length}`)
console.log(`매핑됨:        ${matched}`)
console.log(`매핑 누락:     ${unmatched.length}`)

if (unmatched.length > 0) {
  console.log('\n— 누락 경로 —')
  for (const u of unmatched) {
    console.log(`  ${u.importPath}`)
    if (verbose) console.log(`    at ${u.line}`)
  }
  process.exit(1)
}

console.log('\nOK — 모든 deep import 가 매핑 룰에 포함됨')

#!/usr/bin/env node
// Occam rename — homonym 충돌 해소
//   surfaces/ → shells/    (token `surface` 와 동음이의)
//   content/  → features/  ("콘텐츠 모델" 과 동음이의, FSD de facto)
//
// usage:
//   node scripts/migration/occam-rename-layers.mjs --dry
//   node scripts/migration/occam-rename-layers.mjs --apply

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const DRY = !process.argv.includes('--apply')

const RENAMES = [
  { from: 'packages/ds/src/surfaces', to: 'packages/ds/src/shells' },
  { from: 'packages/ds/src/content',  to: 'packages/ds/src/features' },
]

// import path replacements (string-level, both alias and relative)
const PATTERNS = [
  // alias
  [/@p\/ds\/surfaces\b/g, '@p/ds/shells'],
  [/@p\/ds\/content\b/g,  '@p/ds/features'],
  // relative from packages/ds/src/*
  [/(['"`])\.\/surfaces\//g, '$1./shells/'],
  [/(['"`])\.\/content\//g,  '$1./features/'],
  [/(['"`])\.\.\/surfaces\//g, '$1../shells/'],
  [/(['"`])\.\.\/content\//g,  '$1../features/'],
  // deeper relative (../../../ etc.)
  [/((?:\.\.\/){2,})surfaces\//g, '$1shells/'],
  [/((?:\.\.\/){2,})content\//g,  '$1features/'],
  // glob patterns in import.meta.glob
  [/@p\/ds\/surfaces\//g, '@p/ds/shells/'],
  [/@p\/ds\/content\//g,  '@p/ds/features/'],
]

function sh(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim()
}

function listFiles() {
  // tracked + untracked, code only
  const out = sh('git ls-files -co --exclude-standard')
  return out.split('\n').filter((p) =>
    /\.(ts|tsx|mjs|cjs|js|jsx|json|md|mdx)$/.test(p) &&
    !p.startsWith('node_modules/') &&
    p !== 'scripts/migration/occam-rename-layers.mjs',
  )
}

function rewriteFile(path) {
  const before = readFileSync(path, 'utf8')
  let after = before
  for (const [re, rep] of PATTERNS) after = after.replace(re, rep)
  if (after !== before) {
    if (!DRY) writeFileSync(path, after)
    return true
  }
  return false
}

function moveFolder(from, to) {
  if (!existsSync(join(ROOT, from))) {
    console.log(`  skip (not found): ${from}`)
    return
  }
  if (existsSync(join(ROOT, to))) {
    console.log(`  skip (target exists): ${to}`)
    return
  }
  const cmd = `git mv "${from}" "${to}"`
  console.log(`  ${DRY ? '[dry] ' : ''}${cmd}`)
  if (!DRY) sh(cmd)
}

console.log(`\n=== Occam rename layers ${DRY ? '(DRY RUN)' : '(APPLY)'} ===\n`)

console.log('Step 1: git mv folders')
for (const { from, to } of RENAMES) moveFolder(from, to)

console.log('\nStep 2: rewrite import paths')
const files = listFiles()
let changed = 0
for (const f of files) {
  if (rewriteFile(f)) {
    changed++
    console.log(`  ${DRY ? '[dry] ' : ''}rewrite: ${f}`)
  }
}
console.log(`\n${changed} file(s) ${DRY ? 'would be' : ''} rewritten.`)

if (DRY) console.log('\nRe-run with --apply to execute.\n')

#!/usr/bin/env node
/**
 * lint-ds-tokens — apply.ts/seed/tokens.ts 가 emit 하는 모든 `--ds-*` 가
 * (1) 어느 foundation `_category.ts:prefixes` 에 매칭되는지 (orphan = 'etc' lane fall)
 * (2) prefix 충돌이 없는지 (한 prefix 가 두 카테고리에 동시 등록)
 *
 * SSoT: foundations/<cat>/_category.ts 의 prefixes 배열 (+ preset seed knobs).
 * orphan ❌ · collision ❌ — 둘 중 하나라도 있으면 exit 1.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const APPLY = path.join(ROOT, 'packages/ds/src/tokens/internal/preset/apply.ts')
const SEED  = path.join(ROOT, 'packages/ds/src/tokens/internal/seed/tokens.ts')
const FOUND = path.join(ROOT, 'packages/ds/src/tokens/semantic')

const read = p => fs.readFileSync(p, 'utf8')

// ── 1. emit var 추출 ───────────────────────────────────
const VAR_RE = /--ds-[a-z0-9-]+/g
const emitted = new Set()
for (const f of [APPLY, SEED]) {
  for (const m of read(f).matchAll(VAR_RE)) emitted.add(m[0])
}

// ── 2. foundations/<cat>/_category.ts:prefixes 수집 ─────
const PRESET = ['--ds-hue', '--ds-density', '--ds-depth', '--ds-step']
const table = [] // [prefix, cat]
for (const cat of fs.readdirSync(FOUND)) {
  const f = path.join(FOUND, cat, '_category.ts')
  if (!fs.existsSync(f)) continue
  const src = read(f)
  const m = src.match(/prefixes\s*:\s*\[([\s\S]*?)\]/)
  if (!m) continue
  for (const pm of m[1].matchAll(/['"](--ds-[^'"]+)['"]/g)) table.push([pm[1], cat])
}
for (const p of PRESET) table.push([p, 'preset'])

// ── 3. 충돌 검사 ────────────────────────────────────────
const byPrefix = new Map()
for (const [pre, cat] of table) {
  const prev = byPrefix.get(pre)
  if (prev && prev !== cat) {
    console.error(`✗ prefix 충돌 — '${pre}' 가 '${prev}' 와 '${cat}' 양쪽`)
    process.exitCode = 1
  }
  byPrefix.set(pre, cat)
}

// ── 4. orphan 검사 (longest-first) ──────────────────────
const sorted = [...table].sort(([a], [b]) => b.length - a.length)
const orphans = []
const knownH = /^--ds-h[1-6]-/
for (const v of [...emitted].sort()) {
  if (knownH.test(v)) continue
  if (!sorted.find(([pre]) => v.startsWith(pre))) orphans.push(v)
}

if (orphans.length) {
  console.error(`✗ orphan ${orphans.length}개 — _category.ts:prefixes 미등록 → 'etc':`)
  for (const o of orphans) console.error(`    ${o}`)
  process.exitCode = 1
} else if (process.exitCode !== 1) {
  console.log(`✓ ${emitted.size} var · ${table.length} prefix · orphan 0 · collision 0`)
}

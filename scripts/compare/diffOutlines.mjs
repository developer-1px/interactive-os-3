#!/usr/bin/env node
/**
 * Compare two outline JSONs (mock vs impl) emitted by extractOutline and
 * print a diff report grouped by kind.
 *
 * Usage: node scripts/compare/diffOutlines.mjs <mock.json> <impl.json>
 */
import { readFileSync } from 'node:fs'

const [,, mockPath, implPath] = process.argv
if (!mockPath || !implPath) {
  console.error('usage: diffOutlines.mjs <mock.json> <impl.json>')
  process.exit(2)
}

const mock = JSON.parse(readFileSync(mockPath, 'utf8'))
const impl = JSON.parse(readFileSync(implPath, 'utf8'))

const keyOf = (x) => `${x.kind}:${x.parent || '∅'}:${x.label}`
const indexBy = (arr) => {
  const map = new Map()
  for (const it of arr) {
    const k = keyOf(it)
    const bucket = map.get(k)
    if (bucket) bucket.push(it)
    else map.set(k, [it])
  }
  return map
}

const mMap = indexBy(mock)
const iMap = indexBy(impl)

const missing = []    // mock 있음, impl 없음
const extra   = []    // impl 있음, mock 없음
const matched = []    // 양쪽 있음 (메타 차이 있을 수 있음)

for (const [k, ms] of mMap) {
  const is = iMap.get(k) ?? []
  const minCount = Math.min(ms.length, is.length)
  if (ms.length > minCount) missing.push(...ms.slice(minCount))
  if (is.length > minCount) extra.push(...is.slice(minCount))
  for (let i = 0; i < minCount; i++) matched.push({ mock: ms[i], impl: is[i] })
}
for (const [k, is] of iMap) {
  if (!mMap.has(k)) extra.push(...is)
}

// ── pretty print ──
const color = (s, c) => `\x1b[${c}m${s}\x1b[0m`
const RED = 31, GREEN = 32, YELLOW = 33, DIM = 2

const fmt = (x) => {
  const meta = x.meta && Object.keys(x.meta).length
    ? ' ' + color(JSON.stringify(x.meta), DIM)
    : ''
  const parent = x.parent ? color(`[${x.parent}]`, DIM) + ' ' : ''
  return `${x.kind.padEnd(8)} ${parent}${x.label}${meta}`
}

console.log(color(`\n=== Mock outline: ${mock.length} items ===`, DIM))
console.log(color(`=== Impl outline: ${impl.length} items ===\n`, DIM))

if (missing.length) {
  console.log(color(`❌ MISSING in implementation (${missing.length}):`, RED))
  for (const x of missing) console.log('  ' + color('- ', RED) + fmt(x))
} else {
  console.log(color('✓ no missing items', GREEN))
}

console.log()

if (extra.length) {
  console.log(color(`➕ EXTRA in implementation (${extra.length}):`, YELLOW))
  for (const x of extra) console.log('  ' + color('+ ', YELLOW) + fmt(x))
} else {
  console.log(color('✓ no extra items', GREEN))
}

// meta differences for matched
const metaDiffs = matched.filter((m) => {
  const a = JSON.stringify(m.mock.meta || {}), b = JSON.stringify(m.impl.meta || {})
  return a !== b
})
if (metaDiffs.length) {
  console.log(color(`\n⚠  MATCHED with meta differences (${metaDiffs.length}):`, YELLOW))
  for (const { mock, impl } of metaDiffs) {
    console.log('  ' + fmt(mock))
    console.log('    mock:', JSON.stringify(mock.meta || {}))
    console.log('    impl:', JSON.stringify(impl.meta || {}))
  }
}

console.log(color(`\n=== Matched: ${matched.length}  Missing: ${missing.length}  Extra: ${extra.length} ===`, DIM))
process.exit(missing.length ? 1 : 0)

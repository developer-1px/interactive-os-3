#!/usr/bin/env node
/**
 * lint-ds-contracts — data 기반 ui 컴포넌트의 계약 정합성 감사.
 *
 * 차단 조건(🔴 Hatch):
 *   - ControlProps 분파인데 체크 하나라도 실패
 *   - children 주도 분파에서 data 기반으로 쉽게 전환 가능한 케이스 (휴리스틱 경고)
 *
 * 나머지(🟡 분열): 경고만. 수렴 목표로 남김.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, basename } from 'node:path'

const ROOT = process.cwd()
const UI = join(ROOT, 'src/ds/ui')

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.tsx$/.test(e.name)) out.push(p)
  }
  return out
}

// Canonical collection 컴포넌트 화이트리스트 — CollectionProps 타입 시그니처 강제.
// 이 목록에 추가하면 해당 파일은 `CollectionProps` alias 를 import+사용해야 한다.
const CANONICAL_COLLECTIONS = new Set([
  'Menu', 'Listbox', 'Tree', 'Columns',
])

const classify = (src) => {
  if (/\bCollectionProps\b/.test(src) && /\{\s*data\s*,\s*onEvent/.test(src)) return 'controlProps'
  if (/ControlProps/.test(src) && /\{\s*data\s*,\s*onEvent/.test(src)) return 'controlProps'
  if (/export\s+function\s+\w+\s*\(\s*\{[^}]*\bchildren\b/.test(src)) return 'childrenDriven'
  if (/export\s+function\s+\w+\s*\(\s*\{\s*(entries|bars|items|rows|columns)\b/.test(src)) return 'customArray'
  if (/export\s+function\s+\w+\s*\(\s*\{/.test(src)) return 'fieldDriven'
  return 'stateless'
}

const check = (src, kind) => {
  const isControl = kind === 'controlProps'
  const afterExport = src.split(/\bexport\s+(?:function|const)/)[1] ?? ''
  const slotEscape = /@slot\s+children/.test(src)
  const hasChildren = !slotEscape && /\{[^}]*\bchildren\b[^}]*\}/.test(afterExport.split(/[}]\s*:/)[0] ?? afterExport)
  const selfAttach = /useRoving\b/.test(src) || /composeAxes\b/.test(src) || /onKeyDown\s*=\s*\{/.test(src)
  const rovingRole = /\b(useRoving|composeAxes|navigate\s*\()/.test(src)
  const bannedVariant = /^\s*(variant|size)\s*[?:]/m.test(afterExport)
  const emitsRole = /role=["'][\w-]+["']/.test(src)
    || /aria-\w+=/.test(src)
    || /<(dialog|button|input|select|textarea|details|summary)\b/i.test(src)

  return [
    { id: 'data-prop', pass: isControl },
    { id: 'on-event',  pass: isControl },
    { id: 'no-children', pass: !hasChildren },
    { id: 'roving-self-attach', pass: !rovingRole || selfAttach },
    { id: 'no-variant', pass: !bannedVariant },
    { id: 'aria-role-emit', pass: emitsRole },
  ]
}

const files = walk(UI)
let fail = 0
let warn = 0
const report = []

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const name = basename(file, '.tsx')
  const kind = classify(src)
  const checks = check(src, kind)
  const failed = checks.filter((c) => !c.pass)
  const rel = relative(ROOT, file)

  // Canonical 화이트리스트: CollectionProps 타입 시그니처 강제
  if (CANONICAL_COLLECTIONS.has(name)) {
    if (!/\bCollectionProps\b/.test(src)) {
      fail += 1
      report.push(`🔴 ${rel} — canonical collection은 CollectionProps<> 타입 필수 (현재: ${kind})`)
    }
  }

  if (kind === 'controlProps' && failed.length > 0) {
    fail += failed.length
    report.push(`🔴 ${rel} [${kind}]`)
    for (const f of failed) report.push(`   ✗ ${f.id}`)
  } else if (kind === 'childrenDriven' || kind === 'customArray') {
    warn += 1
    report.push(`🟡 ${rel} [${kind}] — 통일 탈선 (ControlProps 수렴 대상)`)
  } else if (failed.length > 0) {
    // fieldDriven/stateless — no block, just note
    warn += 1
    report.push(`⚪ ${rel} [${kind}] failed: ${failed.map((f) => f.id).join(', ')}`)
  }
}

if (report.length > 0) {
  console.log(report.join('\n'))
  console.log('')
}
console.log(`ds-contracts: ${fail} hatch, ${warn} drift`)
process.exit(fail > 0 ? 1 : 0)

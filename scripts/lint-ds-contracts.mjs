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
  'RadioGroup', 'CheckboxGroup',
  'Top10List', 'BarChart',
])

const ENTITY_HINTS = /\b(tone|abbr|meta|actions|footer|desc|name|topBadge|change|changeDir)\s*[?:]/g

const classify = (src) => {
  // CollectionProps 타입 사용 + data prop 존재 → collection (onEvent는 optional)
  if (/\bCollectionProps\b/.test(src) && /\{\s*data\b/.test(src)) return 'collection'
  if (/ControlProps/.test(src) && /\{\s*data\s*,\s*onEvent/.test(src)) return 'collection'
  if (/@slot\s+children/.test(src)) return 'composable'
  if (/export\s+function\s+\w+\s*\(\s*\{[^}]*\bchildren\b/.test(src)) return 'drift'
  if (/export\s+function\s+\w+\s*\(\s*\{\s*(entries|bars|items|rows|columns)\b/.test(src)) return 'drift'
  const hits = (src.match(ENTITY_HINTS) ?? []).length
  if (hits >= 2) return 'entity'
  return 'control'
}

const check = (src, kind) => {
  const isControl = kind === 'collection'
  const afterExport = src.split(/\bexport\s+(?:function|const)/)[1] ?? ''
  const slotEscape = /@slot\s+children/.test(src)
  const hasChildren = !slotEscape && /\{[^}]*\bchildren\b[^}]*\}/.test(afterExport.split(/[}]\s*:/)[0] ?? afterExport)
  const selfAttach = /useRoving\b/.test(src) || /composeAxes\b/.test(src) || /onKeyDown\s*=\s*\{/.test(src)
  const rovingRole = /\b(useRoving|composeAxes|navigate\s*\()/.test(src)
  const bannedVariant = /^\s*(variant|size)\s*[?:]/m.test(afterExport)
  const emitsRole = /role=["'][\w-]+["']/.test(src)
    || /aria-\w+=/.test(src)
    || /<(dialog|button|input|select|textarea|details|summary|ol|ul|li|figure|figcaption|meter|progress|article|nav|header|footer|section)\b/i.test(src)

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

  // 진짜 불변(예외 0): ui/ 전 컴포넌트는 onKeyDown 을 prop 으로 노출하지 않는다.
  // roving 은 self-attach (ds/core/gesture 헬퍼 내장). 소비자가 키보드를 다루면 미완성.
  if (/^\s*onKeyDown\s*\??\s*:/m.test(src)) {
    fail += 1
    report.push(`🔴 ${rel} — onKeyDown prop 노출 금지 (roving self-attach 불변)`)
  }

  // 직렬화 불변(WARN): entity / control 의 props 타입에 ReactNode|ReactElement 등장 시 경고.
  // 데이터 주도(string/number/구조화 객체)로 좁혀라. composable(@slot children) 면제.
  if (kind === 'entity' || kind === 'control') {
    const propTypeBlock = src.split(/\bexport\s+(?:function|const)/)[0] ?? ''
    const m = propTypeBlock.match(/^\s*(\w+)\s*\??\s*:\s*(ReactNode|ReactElement|JSX\.Element)\b/m)
    if (m) {
      warn += 1
      report.push(`🟡 ${rel} [${kind}] — prop "${m[1]}: ${m[2]}" 직렬화 불가 (string|구조화 객체로 좁혀라)`)
    }
  }

  // 직렬화 불변(WARN): cloneElement / Children.* 사용 시 경고. composable 면제.
  // children 변형은 데이터 주도 위반. data prop으로 받아 자체 렌더해라.
  if (kind !== 'composable' && (/\bcloneElement\b/.test(src) || /\bChildren\.(map|toArray|forEach|count|only)\b/.test(src))) {
    warn += 1
    report.push(`🟡 ${rel} — cloneElement / Children.* 사용 (children 변형 = 데이터 주도 위반)`)
  }

  // Canonical 화이트리스트: CollectionProps 타입 시그니처 강제
  if (CANONICAL_COLLECTIONS.has(name)) {
    if (!/\bCollectionProps\b/.test(src)) {
      fail += 1
      report.push(`🔴 ${rel} — canonical collection은 CollectionProps<> 타입 필수 (현재: ${kind})`)
    }
  }

  if (kind === 'collection' && failed.length > 0) {
    fail += failed.length
    report.push(`🔴 ${rel} [${kind}]`)
    for (const f of failed) report.push(`   ✗ ${f.id}`)
  } else if (kind === 'drift') {
    warn += 1
    report.push(`🟡 ${rel} [drift] — 통일 탈선 (ControlProps 수렴 대상)`)
  } else if (failed.length > 0) {
    // entity/control/composable — baseline, 경고만
    warn += 1
    report.push(`⚪ ${rel} [${kind}] failed: ${failed.map((f) => f.id).join(', ')}`)
  }
}

// Resource 단일 인터페이스 — routes/**에서 useSyncExternalStore 직접 호출 금지.
// 공유 도메인 데이터 read/write는 useResource(resource) 단일 인터페이스로만.
// 컴포넌트 로컬 useState는 허용 (UI state). 모듈 스코프 store 구독은 useResource로 흡수.
const ROUTES = join(ROOT, 'src/routes')
const walkAll = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walkAll(p, out)
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(p)
  }
  return out
}
for (const file of walkAll(ROUTES)) {
  const src = readFileSync(file, 'utf8')
  const rel = relative(ROOT, file)
  if (/\buseSyncExternalStore\b/.test(src)) {
    warn += 1
    report.push(`🟡 ${rel} — useSyncExternalStore 직접 호출 (useResource 단일 인터페이스로 수렴 권장)`)
  }
}

if (report.length > 0) {
  console.log(report.join('\n'))
  console.log('')
}
console.log(`ds-contracts: ${fail} hatch, ${warn} drift`)
process.exit(fail > 0 ? 1 : 0)

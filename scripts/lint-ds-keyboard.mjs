#!/usr/bin/env node
/**
 * lint-ds-keyboard — role 별 키보드 계약 정합성 감사.
 *
 * ARIA APG 기준:
 *   - roving role (menu/menubar/listbox/tree/grid/treegrid/tablist/toolbar/radiogroup)
 *     → useRoving 또는 composeAxes 필수 (arrow 네비 자동 수립)
 *   - native role (button/checkbox/switch/textbox/combobox/dialog/group via details)
 *     → 네이티브 엘리먼트 사용 시 브라우저가 kbd 제공
 *
 * 🔴 Hatch:
 *   - ControlProps/CollectionProps 컴포넌트가 roving role emit 하는데 useRoving 없음
 *   - roving role emit 하는 non-native 컴포넌트가 onKeyDown 핸들러 없음
 * 🟡 Warn:
 *   - role 있으나 parent 의존 (서브파트) — 설계상 OK 지만 기록
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, basename } from 'node:path'

const ROOT_DIR = process.cwd()
const UI = join(ROOT_DIR, 'src/ds/ui')

const ROVING_ROLES = new Set([
  'menu', 'menubar', 'listbox', 'tree', 'treegrid',
  'grid', 'tablist', 'toolbar', 'radiogroup',
])

// parent가 kbd를 관리하므로 자체 구현 불필요한 서브파트 role
const SUBPART_ROLES = new Set([
  'menuitem', 'menuitemcheckbox', 'menuitemradio',
  'option', 'treeitem',
  'tab', 'row', 'gridcell', 'columnheader', 'rowheader', 'rowgroup',
  'radio', 'presentation', 'none',
])

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.tsx$/.test(e.name)) out.push(p)
  }
  return out
}

const files = walk(UI)
let fail = 0
let warn = 0
const report = []

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const name = basename(file, '.tsx')
  const rel = relative(ROOT_DIR, file)

  const roleMatch = src.match(/role=["']([a-z]+)["']/)
  const role = roleMatch?.[1] ?? null
  const hasCollection = /\b(CollectionProps|ControlProps)\b/.test(src)
  const usesRoving = /\buseRoving\b/.test(src) || /\buseRovingDOM\b/.test(src) || /\bcomposeAxes\b/.test(src)
  const hasOnKeyDown = /onKeyDown\s*=\s*\{/.test(src)
  const hasNative = /<(button|input|select|textarea|details|summary|dialog)\b/.test(src)

  if (!role && !hasCollection) continue

  // roving role emit + not native → useRoving / composeAxes / onKeyDown 필수
  if (role && ROVING_ROLES.has(role)) {
    if (!usesRoving && !hasNative && !hasOnKeyDown) {
      fail += 1
      report.push(`🔴 ${rel} — role="${role}" kbd 핸들러 없음 (useRoving/composeAxes/onKeyDown 중 하나 필요)`)
      continue
    }
    if (!usesRoving && hasOnKeyDown) {
      warn += 1
      report.push(`🟡 ${rel} — role="${role}" 자체 onKeyDown (composeAxes 승격 고려)`)
      continue
    }
  }

  if (role && SUBPART_ROLES.has(role)) {
    // parent 관리
    report.push(`∅  ${rel} — role="${role}" (parent collection kbd 위임)`)
    continue
  }

  if (hasCollection && !role && !usesRoving && !hasNative) {
    // Collection 인데 role 도 useRoving 도 native 도 없음 — display-only 또는 파생
    // 실제로 Menu.tsx 는 role 없이 wrapping button + popover 내부에서 처리.
    // 과검출 방지 — 그냥 info.
    report.push(`∅  ${rel} — Collection (display 또는 wrapping, kbd 위임)`)
    continue
  }

  if (role && !ROVING_ROLES.has(role) && !SUBPART_ROLES.has(role)) {
    // 기타 role (group/separator/tooltip/feed 등) — role 별 kbd 요구사항 상이
    report.push(`⚪ ${rel} — role="${role}" (passive 또는 커스텀)`)
    continue
  }
}

if (report.length > 0) {
  console.log(report.join('\n'))
  console.log('')
}
console.log(`ds-keyboard: ${fail} hatch, ${warn} warn`)
process.exit(fail > 0 ? 1 : 0)

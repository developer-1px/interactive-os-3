import { fromKeyMap, tagAxis, type Axis } from './axis'
import { isDisabled } from '../types'
import { INTENTS } from './keys'

/**
 * select — single-select chord (`Space` / click). Emits `{type:'select', id}`.
 * APG `/listbox/` `/treeview/` single-select 의 manual 모드에 매핑.
 *
 * key chord 매칭 + template 합성은 `fromKeyMap` 가 처리. isDisabled gate 만 axis
 * wrapper 에 유지. Click 은 entries 의 1급 chord — handler 형태로 등재 (`ids: [id]`
 * 배열 페이로드라 plain template 로 lift 불가).
 *
 * `aria-selected` 만 책임. `Enter` (default action) 은 activate 가 보유 — 합성
 * 순서로 분리: composeAxes(..., select, ..., activate) → Space 는 select 흡수,
 * Enter 는 activate 로 fall-through.
 *
 * focus-driven selection-follows-focus 는 `gesture/selectionFollowsFocus` 가
 * navigate→select 변환으로 담당. select axis 는 manual chord 만.
 */
const selectKeys = fromKeyMap([
  [INTENTS.select.toggle, (_d, id) => [{ type: 'select', ids: [id] }]],
  ['Click', (_d, id) => [{ type: 'select', ids: [id] }]],
])

export const select: Axis = tagAxis((d, id, t) => {
  if (isDisabled(d, id)) return null
  return selectKeys(d, id, t)
}, selectKeys.chords, selectKeys.spec.bindings)

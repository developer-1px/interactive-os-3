import { fromKeyMap, type Axis } from './axis'
import { isDisabled } from '../types'
import { INTENTS } from './keys'

/**
 * select — single-select chord (`Space` / click). Emits `{type:'select', id}`.
 * APG `/listbox/` `/treeview/` single-select 의 manual 모드에 매핑.
 *
 * key chord 매칭 + template 합성은 `fromKeyMap` 가 처리. click 과 isDisabled
 * gate 는 axis wrapper 에 유지.
 *
 * `aria-selected` 만 책임. `Enter` (default action) 은 activate 가 보유 — 합성
 * 순서로 분리: composeAxes(..., select, ..., activate) → Space 는 select 흡수,
 * Enter 는 activate 로 fall-through.
 *
 * focus-driven selection-follows-focus 는 `gesture/selectionFollowsFocus` 가
 * navigate→select 변환으로 담당. select axis 는 manual chord 만.
 */
const selectByKey = fromKeyMap([
  [INTENTS.select.toggle, { type: 'select' }],
])

export const select: Axis = (d, id, t) => {
  if (isDisabled(d, id)) return null
  if (t.kind === 'click') return [{ type: 'select', id }]
  return selectByKey(d, id, t)
}

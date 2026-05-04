import type { Axis } from './axis'
import { isDisabled } from '../types'
import { INTENTS, matchChord } from './keys'

/**
 * select — single-select chord (`Space` / click). Emits `{type:'select', id}`.
 * APG `/listbox/` `/treeview/` single-select 의 manual 모드에 매핑.
 *
 * `aria-selected` 만 책임. `Enter` (default action) 은 activate 가 보유 — 합성
 * 순서로 분리: composeAxes(..., select, ..., activate) → Space 는 select 흡수,
 * Enter 는 activate 로 fall-through.
 *
 * focus-driven selection-follows-focus 는 `gesture/selectionFollowsFocus` 가
 * navigate→select 변환으로 담당. select axis 는 manual chord 만.
 */
export const select: Axis = (d, id, t) => {
  if (isDisabled(d, id)) return null
  if (t.kind === 'click') return [{ type: 'select', id }]
  if (t.kind === 'key' && matchChord(t, INTENTS.select.toggle))
    return [{ type: 'select', id }]
  return null
}

import type { Reducer } from './compose'
import { batchToggleField, singleReplaceField, singleToggleField } from './fieldReducer'

const replaceChecked = singleReplaceField('checked')
const toggleCheckedSingle = singleToggleField('checked')
const toggleCheckedBatch = batchToggleField('checked')

/**
 * checkToggle — `aria-checked` 축의 토글/세팅 reducer fragment.
 *
 * 처리 어휘: `check` (단일) · `checkMany` (batch).
 * `to` 가 undefined 면 토글, 명시되면 세팅 (boolean | 'mixed').
 *
 * APG-aligned: checkbox group · switch group · 일반 multi-toggle.
 *
 * Compose with `reduce`:
 *   const myReduce = composeReducers(reduce, checkToggle)
 */
export const checkToggle: Reducer = (d, e) => {
  if (e.type === 'check') return toggleCheckedSingle(d, e.id, e.to)
  if (e.type === 'checkMany') return toggleCheckedBatch(d, e.ids, e.to)
  return d
}

/**
 * singleCheck — `aria-checked` 축의 single-of-group reducer fragment.
 *
 * `check` (직접) · `activate` (selection-follows-focus 의 default action) 둘 다 처리 —
 * radio / listbox(single) 입력을 같은 모양으로 흡수. select 축의 `singleSelect` 거울.
 *
 * Compose with `reduce`:
 *   const myReduce = composeReducers(reduce, singleCheck)
 */
export const singleCheck: Reducer = (d, e) => {
  if (e.type !== 'check' && e.type !== 'activate') return d
  return replaceChecked(d, e.id).d
}

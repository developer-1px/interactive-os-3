import type { Reducer } from './compose'
import { batchToggleField, singleReplaceField } from './fieldReducer'

const replaceSelected = singleReplaceField('selected')
const replaceCurrent = singleReplaceField('current')
const toggleSelected = batchToggleField('selected')

/**
 * singleSelect — `select` / `activate` → `entity.selected` single-replace + focus 갱신.
 * APG-aligned: tabs / listbox(single) / menu / menubar.
 *
 * Compose with `reduce`:
 *   const myReduce = composeReducers(reduce, singleSelect)
 */
export const singleSelect: Reducer = (d, e) => {
  if (e.type !== 'activate' && e.type !== 'select') return d
  const r = replaceSelected(d, e.id)
  // selected → focused (single-select APG semantics)
  const prevFocus = d.meta?.focus
  if (prevFocus === e.id) return r.d
  return { ...r.d, meta: { ...r.d.meta, focus: e.id } }
}

/**
 * singleCurrent — `activate` → `entity.current` single-replace. Navigation list
 * 의 `aria-current="page"` 어휘. select(컬렉션) ≠ current(landmark).
 */
export const singleCurrent: Reducer = (d, e) => {
  if (e.type !== 'activate') return d
  return replaceCurrent(d, e.id).d
}

/**
 * multiSelectToggle — multi-mode `entity.selected` reducer fragment.
 *
 * - `select` → single-replace (de facto Finder/Gmail plain click). focus 무관.
 * - `selectMany` → batch toggle/set.
 *
 * APG-aligned: listbox(multi), tree(multi), grid(multi).
 */
export const multiSelectToggle: Reducer = (d, e) => {
  if (e.type === 'select') return replaceSelected(d, e.id).d
  if (e.type === 'selectMany') return toggleSelected(d, e.ids, e.to)
  return d
}

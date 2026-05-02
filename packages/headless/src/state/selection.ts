import { isMetaId, type NormalizedData, type UiEvent } from '../types'
import { reduce } from './reduce'

export type Reducer = (d: NormalizedData, e: UiEvent) => NormalizedData

/**
 * composeReducers — left-to-right reducer composition. Each reducer sees the
 * output of the previous one. Identity reducers (e.g. `reduce` for activate)
 * pass the data through unchanged so subsequent reducers (selection / value /
 * domain) can layer their semantics.
 */
export const composeReducers =
  (...rs: Reducer[]): Reducer =>
  (d, e) =>
    rs.reduce((acc, r) => r(acc, e), d)

/**
 * singleSelect — single-selection reducer fragment.
 *
 * On `activate`, marks `e.id` as selected and clears `selected` on all other
 * non-meta entities. APG-aligned: tabs/listbox(single)/radio/menu/menubar all
 * follow this pattern.
 *
 * Compose with `reduce`:
 *   const myReduce = composeReducers(reduce, singleSelect)
 */
export const singleSelect: Reducer = (d, e) => {
  if (e.type !== 'activate') return d
  const entities = { ...d.entities }
  let mutated = false
  for (const id of Object.keys(entities)) {
    if (isMetaId(id)) continue
    const ent = entities[id]
    if (!ent) continue
    const wasSelected = Boolean(ent.data?.selected)
    const willBe = id === e.id
    if (wasSelected === willBe) continue
    entities[id] = { ...ent, data: { ...ent.data, selected: willBe } }
    mutated = true
  }
  return mutated ? { ...d, entities } : d
}

/**
 * setValue — numeric `value` reducer fragment for slider/splitter/spinner.
 *
 * On `value` events, writes `e.value` into `entities[e.id].data.value`.
 * Compose with `reduce` for slider/splitter demos.
 */
export const setValue: Reducer = (d, e) => {
  if (e.type !== 'value') return d
  const ent = d.entities[e.id]
  if (!ent) return d
  return {
    ...d,
    entities: { ...d.entities, [e.id]: { ...ent, data: { ...ent.data, value: e.value } } },
  }
}

/**
 * multiSelect — multi-selection reducer fragment.
 *
 * On `activate`, toggles `selected` on `e.id` only. Other entities untouched.
 * APG-aligned: listbox(multi), checkbox group.
 */
export const multiSelectToggle: Reducer = (d, e) => {
  if (e.type !== 'activate') return d
  const ent = d.entities[e.id]
  if (!ent || isMetaId(e.id)) return d
  return {
    ...d,
    entities: {
      ...d.entities,
      [e.id]: { ...ent, data: { ...ent.data, selected: !ent.data?.selected } },
    },
  }
}

/**
 * reduceWithDefaults — drop-in complete reducer.
 *
 * Composes `reduce` (focus/expand/typeahead/pan/zoom) + `singleSelect` +
 * `setValue`. Use this when you want APG-default semantics out of the box.
 * For multi-select or custom selection, compose your own with
 * `composeReducers(reduce, multiSelectToggle, setValue, ...)`.
 */
export const reduceWithDefaults: Reducer = composeReducers(reduce, singleSelect, setValue)

import { FOCUS, isMetaId } from '../types'
import type { Reducer } from './compose'

/**
 * singleSelect — single-selection reducer fragment.
 *
 * On `activate`:
 *  - marks `e.id` as selected, clears others (`selected: false`)
 *  - moves FOCUS to `e.id` ("selected = focused" — APG single-select semantics)
 *
 * APG-aligned: tabs / listbox(single) / radio / menu / menubar follow this.
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
  // selected → focused (single-select)
  const prevFocus = d.entities[FOCUS]?.data?.id as string | undefined
  if (prevFocus !== e.id) {
    entities[FOCUS] = { id: FOCUS, data: { id: e.id } }
    mutated = true
  }
  return mutated ? { ...d, entities } : d
}

/**
 * multiSelectToggle — toggles `selected` on `select` (per-id) and `selectMany`
 * (batch). Batch path is O(N) with a single entities spread regardless of N.
 * APG-aligned: listbox(multi), tree(multi), checkbox group.
 */
export const multiSelectToggle: Reducer = (d, e) => {
  if (e.type === 'select') {
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
  if (e.type === 'selectMany') {
    const entities = { ...d.entities }
    let mutated = false
    for (const id of e.ids) {
      const ent = entities[id]
      if (!ent || isMetaId(id)) continue
      const next = e.to ?? !ent.data?.selected
      if (Boolean(ent.data?.selected) === next) continue
      entities[id] = { ...ent, data: { ...ent.data, selected: next } }
      mutated = true
    }
    return mutated ? { ...d, entities } : d
  }
  return d
}

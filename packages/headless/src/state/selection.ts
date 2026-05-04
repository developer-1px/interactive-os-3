import type { Reducer } from './compose'

/**
 * singleSelect — single-selection reducer fragment.
 *
 * On `select` (axis: select) or `activate` (axis: activate, default action):
 *  - marks `e.id` as selected, clears others (`selected: false`)
 *  - moves focus to `e.id` ("selected = focused" — APG single-select semantics)
 *
 * Both events are accepted so single-select hosts can compose `select` axis
 * (ARIA-correct vocabulary: aria-selected) or rely on `activate` (default
 * action that also selects, e.g. tabs/menu) without diverging reducers.
 *
 * APG-aligned: tabs / listbox(single) / radio / menu / menubar follow this.
 *
 * Compose with `reduce`:
 *   const myReduce = composeReducers(reduce, singleSelect)
 */
export const singleSelect: Reducer = (d, e) => {
  if (e.type !== 'activate' && e.type !== 'select') return d
  const entities = { ...d.entities }
  let mutated = false
  for (const id of Object.keys(entities)) {
    const ent = entities[id]
    if (!ent) continue
    const wasSelected = Boolean(ent.selected)
    const willBe = id === e.id
    if (wasSelected === willBe) continue
    entities[id] = { ...ent, selected: willBe }
    mutated = true
  }
  // selected → focused (single-select)
  const prevFocus = d.meta?.focus
  const meta = prevFocus !== e.id ? { ...d.meta, focus: e.id } : d.meta
  if (prevFocus !== e.id) mutated = true
  return mutated ? { ...d, entities, meta } : d
}

/**
 * singleCurrent — navigation single-current reducer fragment.
 *
 * `singleSelect` 의 nav 변종 — `selected` 대신 `current` 를 쓴다 (ARIA `aria-current="page"`).
 * Listbox 가 아니라 navigation list 에서 사용. 어휘 분리: select(컬렉션) ≠ current(landmark).
 */
export const singleCurrent: Reducer = (d, e) => {
  if (e.type !== 'activate') return d
  const entities = { ...d.entities }
  let mutated = false
  for (const id of Object.keys(entities)) {
    const ent = entities[id]
    if (!ent) continue
    const wasCurrent = Boolean(ent.current)
    const willBe = id === e.id
    if (wasCurrent === willBe) continue
    entities[id] = { ...ent, current: willBe }
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
    if (!ent) return d
    return {
      ...d,
      entities: {
        ...d.entities,
        [e.id]: { ...ent, selected: !ent.selected },
      },
    }
  }
  if (e.type === 'selectMany') {
    const entities = { ...d.entities }
    let mutated = false
    for (const id of e.ids) {
      const ent = entities[id]
      if (!ent) continue
      const next = e.to ?? !ent.selected
      if (Boolean(ent.selected) === next) continue
      entities[id] = { ...ent, selected: next }
      mutated = true
    }
    return mutated ? { ...d, entities } : d
  }
  return d
}

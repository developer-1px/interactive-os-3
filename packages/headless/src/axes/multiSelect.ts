import type { Axis } from './axis'
import type { UiEvent } from '../types'
import { enabledSiblings } from './index'

/**
 * multiSelect — `aria-multiselectable` axis. Click/Space toggle, Shift+Arrow
 * range, Ctrl/Meta+A all. Emits `select` events; reducer (`multiSelectToggle`)
 * applies the toggle. Single-select's `activate` is a separate vocabulary so
 * both reducers can coexist in one composition.
 *
 * APG: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/  (Selection)
 */
export const multiSelect: Axis = (d, id, t) => {
  if (t.kind === 'click') {
    return [{ type: 'navigate', id }, { type: 'select', id }]
  }
  if (t.kind !== 'key') return null

  if (t.key === ' ' || t.key === 'Spacebar') {
    return [{ type: 'select', id }]
  }

  if ((t.ctrl || t.meta) && (t.key === 'a' || t.key === 'A')) {
    const ids = enabledSiblings(d, id)
    return ids.map((sid): UiEvent => ({ type: 'select', id: sid }))
  }

  if (t.shift && (t.key === 'ArrowDown' || t.key === 'ArrowUp')) {
    const ids = enabledSiblings(d, id)
    const idx = ids.indexOf(id)
    if (idx < 0) return null
    const nextIdx = t.key === 'ArrowDown' ? idx + 1 : idx - 1
    if (nextIdx < 0 || nextIdx >= ids.length) return null
    const nextId = ids[nextIdx]
    return [
      { type: 'navigate', id: nextId },
      { type: 'select', id: nextId },
    ]
  }

  return null
}

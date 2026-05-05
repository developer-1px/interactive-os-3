import { fromKeyMap, type Axis, type KeyHandler } from './axis'
import { getSelectAnchor, type NormalizedData, type UiEvent } from '../types'
import { enabledSiblings } from './index'
import { INTENTS } from './keys'

/**
 * multiSelect — `aria-multiselectable` axis. anchor-range, Ctrl+A, Shift+Click.
 * single-select 단일 토글은 별도 `select` axis. activate (default action) 와도 분리.
 * Click/Space toggle, Shift+Arrow / Shift+Click anchor-range, Ctrl/Meta+A all.
 * Emits `select` (per-id toggle) and `selectMany` (batch).
 *
 * Range semantics — de facto (Mac Finder · Shopify · Radix · React Aria):
 *   anchor..current = selected · everything outside that range = deselected.
 *   anchor is set by the most recent `select` event (reduce.ts handles).
 *
 * APG: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/  (Selection)
 */

/** Build [navigate, deselect-outside, select-inside] from anchor to `nextId`. */
const rangeFrom = (d: NormalizedData, currentId: string, nextId: string): UiEvent[] => {
  const ids = enabledSiblings(d, currentId)
  const anchor = getSelectAnchor(d) ?? currentId
  const a = ids.indexOf(anchor)
  const b = ids.indexOf(nextId)
  if (a < 0 || b < 0) return [{ type: 'navigate', id: nextId }, { type: 'select', id: nextId }]
  const [from, to] = a <= b ? [a, b] : [b, a]
  const inRange = ids.slice(from, to + 1)
  const outRange = ids.filter((x) => !inRange.includes(x))
  const events: UiEvent[] = [{ type: 'navigate', id: nextId }]
  if (outRange.length) events.push({ type: 'selectMany', ids: outRange, to: false })
  events.push({ type: 'selectMany', ids: inRange, to: true })
  return events
}

const rangeStep = (delta: number): KeyHandler => (d, id) => {
  const ids = enabledSiblings(d, id)
  const idx = ids.indexOf(id)
  if (idx < 0) return null
  const nextIdx = idx + delta
  if (nextIdx < 0 || nextIdx >= ids.length) return null
  return rangeFrom(d, id, ids[nextIdx])
}

const multiSelectKeys: Axis = fromKeyMap([
  [INTENTS.multiSelect.toggle, { type: 'select' }],
  [INTENTS.multiSelect.selectAll, (d, id) => [{ type: 'selectMany', ids: enabledSiblings(d, id), to: true }]],
  [INTENTS.multiSelect.rangeDown, rangeStep(+1)],
  [INTENTS.multiSelect.rangeUp, rangeStep(-1)],
])

export const multiSelect: Axis = (d, id, t) => {
  if (t.kind === 'click') {
    if (t.shift) return rangeFrom(d, id, id)
    return [{ type: 'navigate', id }, { type: 'select', id }]
  }
  return multiSelectKeys(d, id, t)
}

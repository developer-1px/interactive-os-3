import type { Axis } from './axis'
import { getSelectAnchor, type NormalizedData, type UiEvent } from '../types'
import { enabledSiblings } from './index'
import { INTENTS, matchChord } from './keys'

/**
 * multiSelect — `aria-multiselectable` axis. Click/Space toggle, Shift+Arrow /
 * Shift+Click anchor-range, Ctrl/Meta+A all. Emits `select` (per-id toggle) and
 * `selectMany` (batch). Single-select's `activate` is a separate vocabulary so
 * both reducers can coexist.
 *
 * Range semantics — de facto (Mac Finder · Shopify · Radix · React Aria):
 *   anchor..current = selected · everything outside that range = deselected.
 *   anchor is set by the most recent `select` event (reduce.ts handles).
 *
 * APG: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/  (Selection)
 */
// 키 매핑은 `INTENTS.multiSelect` 에서 import (SSOT).
export const multiSelect: Axis = (d, id, t) => {
  const I = INTENTS.multiSelect
  if (t.kind === 'click') {
    if (t.shift) return rangeFrom(d, id, id)
    return [{ type: 'navigate', id }, { type: 'select', id }]
  }
  if (t.kind !== 'key') return null

  if (matchChord(t, I.toggle)) return [{ type: 'select', id }]

  if (matchChord(t, I.selectAll)) {
    return [{ type: 'selectMany', ids: enabledSiblings(d, id), to: true }]
  }

  if (matchChord(t, I.rangeDown) || matchChord(t, I.rangeUp)) {
    const ids = enabledSiblings(d, id)
    const idx = ids.indexOf(id)
    if (idx < 0) return null
    const nextIdx = matchChord(t, I.rangeDown) ? idx + 1 : idx - 1
    if (nextIdx < 0 || nextIdx >= ids.length) return null
    return rangeFrom(d, id, ids[nextIdx])
  }

  return null
}

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

import { fromKeyMap, tagAxis, type Axis, type KeyHandler } from './axis'
import { parseTrigger } from '../trigger'
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
  if (a < 0 || b < 0) return [{ type: 'navigate', id: nextId }, { type: 'select', ids: [nextId] }]
  const [from, to] = a <= b ? [a, b] : [b, a]
  const inRange = ids.slice(from, to + 1)
  const outRange = ids.filter((x) => !inRange.includes(x))
  const events: UiEvent[] = [{ type: 'navigate', id: nextId }]
  if (outRange.length) events.push({ type: 'select', ids: outRange, to: false })
  events.push({ type: 'select', ids: inRange, to: true })
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

/** range to first/last enabled sibling. */
const rangeToEdge = (which: 'first' | 'last'): KeyHandler => (d, id) => {
  const ids = enabledSiblings(d, id)
  if (ids.length === 0) return null
  const target = which === 'first' ? ids[0] : ids[ids.length - 1]
  return rangeFrom(d, id, target)
}

const multiSelectKeys: Axis = fromKeyMap([
  // Space — toggle add/remove + anchor 갱신.
  [INTENTS.multiSelect.toggle, (d, id) => {
    const cur = Boolean(d.entities[id]?.selected)
    return [{ type: 'select', ids: [id], to: !cur, anchor: true }]
  }],
  [INTENTS.multiSelect.selectAll, (d, id) => [{ type: 'select', ids: enabledSiblings(d, id), to: true }]],
  [INTENTS.multiSelect.rangeDown, rangeStep(+1)],
  [INTENTS.multiSelect.rangeUp, rangeStep(-1)],
  // Shift+Space — anchor 부터 현재 focus 까지 range select.
  [INTENTS.multiSelect.rangeFromAnchor, (d, id) => rangeFrom(d, id, id)],
  // $mod+Shift+Home/End — corner 까지 range.
  [INTENTS.multiSelect.rangeToFirst, rangeToEdge('first')],
  [INTENTS.multiSelect.rangeToLast, rangeToEdge('last')],
])

/**
 * Click 변형 4종은 modifier 분기가 wrapper 함수에 있어 fromKeyMap entries 로 lift
 * 불가 — spec.bindings 를 wrapper 에서 명시 보강. emits 타입 list 는 정적 정본,
 * id/ids/to/anchor 등은 runtime 계산이므로 `dynamic: true`.
 */
const clickBindings: ReadonlyArray<{ trigger: string; emits: { type: string }[]; dynamic: true }> = [
  { trigger: 'Click', emits: [{ type: 'navigate' }, { type: 'select' }], dynamic: true },
  { trigger: 'Shift+Click', emits: [{ type: 'navigate' }, { type: 'select' }], dynamic: true },
  { trigger: 'Meta+Click', emits: [{ type: 'navigate' }, { type: 'select' }], dynamic: true },
  { trigger: 'Control+Click', emits: [{ type: 'navigate' }, { type: 'select' }], dynamic: true },
]

export const multiSelect: Axis = tagAxis((d, id, t) => {
  const p = parseTrigger(t)
  if (p.kind === 'click') {
    if (p.shift) return rangeFrom(d, id, id)
    if (p.meta || p.ctrl) {
      const cur = Boolean(d.entities[id]?.selected)
      return [
        { type: 'navigate', id },
        { type: 'select', ids: [id], to: !cur, anchor: true },
      ]
    }
    return [{ type: 'navigate', id }, { type: 'select', ids: [id], anchor: true }]
  }
  return multiSelectKeys(d, id, t)
}, [...multiSelectKeys.chords, ...clickBindings.map((b) => b.trigger)],
[...multiSelectKeys.spec.bindings, ...clickBindings])

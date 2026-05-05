import type { Axis, KeyHandler } from './axis'
import type { UiEvent } from '../types'
import { ROOT, getChildren, isDisabled } from '../types'
import { parentOf } from './index'
import { INTENTS, matchChord } from './keys'

/**
 * expand — accordion·menu 의 단순 open/close (aria-expanded). branch leaf 통과 +
 * nextVisibleLeaf 도출은 treeExpand. 키 매핑은 `INTENTS.expand` SSOT.
 */
export const expand: Axis = (d, id, t) => {
  if (t.kind !== 'key') return null
  const kids = getChildren(d, id)
  if (kids.length > 0 && !isDisabled(d, id) && matchChord(t, INTENTS.expand.open)) {
    const events: UiEvent[] = [{ type: 'expand', id, open: true }]
    const first = kids.find((c) => !isDisabled(d, c))
    if (first) events.push({ type: 'navigate', id: first })
    return events
  }
  if (matchChord(t, INTENTS.expand.close)) {
    const p = parentOf(d, id)
    if (p && p !== ROOT) return [
      { type: 'expand', id: p, open: false },
      { type: 'navigate', id: p },
    ]
  }
  return null
}

/**
 * seedExpand — `KeyMap` handler primitive. id 를 open 하고 seed(첫/끝 enabled child)
 * 로 navigate. axis factory 가 chord 별로 다른 seed 를 매핑할 때 사용.
 *
 * @example
 *   fromKeyMap([
 *     [INTENTS.expand.open, seedExpand('first')],
 *     [[KEYS.ArrowUp],      seedExpand('last')],
 *   ])
 */
export const seedExpand = (seed: 'first' | 'last'): KeyHandler => (d, id) => {
  const kids = getChildren(d, id)
  if (kids.length === 0 || isDisabled(d, id)) return null
  const enabled = kids.filter((c) => !isDisabled(d, c))
  const events: UiEvent[] = [{ type: 'expand', id, open: true }]
  const target = seed === 'first' ? enabled[0] : enabled[enabled.length - 1]
  if (target) events.push({ type: 'navigate', id: target })
  return events
}

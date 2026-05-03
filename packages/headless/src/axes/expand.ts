import type { Axis } from './axis'
import type { UiEvent } from '../types'
import { ROOT, getChildren, isDisabled } from '../types'
import { parentOf } from './index'
import { INTENTS, matchChord } from './keys'

/**
 * expand — open/close 키 매핑은 `INTENTS.expand` 에서 import (SSOT).
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
 * expandKeys — `expand` 의 일반화 factory. open 키와 seed(첫/끝 자식) 를 명시.
 *
 * openKeys 는 단순 string 배열 (modifier 무시) 또는 `KeyChord[]` (modifier 정밀).
 * SSOT 정합을 위해 가능하면 `INTENTS` 의 chord 를 import 해서 전달 권장.
 *
 * 사용처:
 *   - menubar top: `expandKeys([KEYS.ArrowDown, KEYS.Enter, KEYS.Space], 'first')`
 *
 * close 분기는 별도(또는 `escape` axis) — `expandKeys` 는 open 만 책임.
 */
export const expandKeys =
  (openKeys: readonly string[], seed: 'first' | 'last' = 'first'): Axis =>
  (d, id, t) => {
    if (t.kind !== 'key') return null
    if (!openKeys.includes(t.key)) return null
    const kids = getChildren(d, id)
    if (kids.length === 0 || isDisabled(d, id)) return null
    const enabled = kids.filter((c) => !isDisabled(d, c))
    const events: UiEvent[] = [{ type: 'expand', id, open: true }]
    const target = seed === 'first' ? enabled[0] : enabled[enabled.length - 1]
    if (target) events.push({ type: 'navigate', id: target })
    return events
  }

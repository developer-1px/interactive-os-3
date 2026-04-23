import type { Axis } from '../core/axis'
import type { Event } from '../core/types'
import { ROOT, getChildren, isDisabled } from '../core/types'
import { parentOf } from './index'

const OPEN_KEYS = new Set(['ArrowRight', 'Enter', ' '])

export const expand: Axis = (d, id, k) => {
  const kids = getChildren(d, id)
  if (kids.length > 0 && !isDisabled(d, id) && OPEN_KEYS.has(k.key)) {
    const events: Event[] = [{ type: 'expand', id, open: true }]
    const first = kids.find((c) => !isDisabled(d, c))
    if (first) events.push({ type: 'navigate', id: first })
    return events
  }
  if (k.key === 'ArrowLeft') {
    const p = parentOf(d, id)
    if (p && p !== ROOT) return [
      { type: 'expand', id: p, open: false },
      { type: 'navigate', id: p },
    ]
  }
  return null
}

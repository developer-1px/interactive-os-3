import type { Axis } from './axis'
import type { Event } from '../types'
import { ROOT, getChildren, isDisabled } from '../types'
import { parentOf } from './index'

const OPEN_KEYS = new Set(['ArrowRight', 'Enter', ' '])

export const expand: Axis = (d, id, t) => { if (t.kind !== "key") return null; const k = t;
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

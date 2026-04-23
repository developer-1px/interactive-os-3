import type { Axis } from '../core/axis'
import type { Event } from '../core/types'
import { ROOT, getChildren, isDisabled } from '../core/types'
import { parentOf } from './index'

const OPEN_KEYS = new Set(['ArrowRight', 'Enter', ' '])

export const expand: Axis = (d, id, k) => {
  const kids = getChildren(d, id)
  const canOpen = kids.length > 0 && !isDisabled(d, id) && OPEN_KEYS.has(k.key)
  const first = canOpen ? kids.find((c) => !isDisabled(d, c)) : undefined
  const openEvents: Event[] | null = canOpen
    ? [
        { type: 'expand', id, open: true },
        ...(first ? [{ type: 'navigate', id: first } as Event] : []),
      ]
    : null

  const p = k.key === 'ArrowLeft' ? parentOf(d, id) : undefined
  const closeEvents: Event[] | null =
    p && p !== ROOT
      ? [
          { type: 'expand', id: p, open: false },
          { type: 'navigate', id: p },
        ]
      : null

  return openEvents ?? closeEvents
}

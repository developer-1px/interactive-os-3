import type { Axis } from '../core/axis'
import type { Event } from '../core/types'
import { getLabel, getTypeahead } from '../core/types'
import { isPrintable } from '../core/key'
import { enabledSiblings } from './index'

const WINDOW_MS = 500

export const typeahead: Axis = (d, id, k) => {
  if (!isPrintable(k)) return null
  const now = Date.now()
  const { buf, deadline } = getTypeahead(d)
  const nextBuf = (now < deadline ? buf : '') + k.key.toLowerCase()
  const match = enabledSiblings(d, id).find((sid) => getLabel(d, sid).toLowerCase().startsWith(nextBuf))
  const events: Event[] = [{ type: 'typeahead', buf: nextBuf, deadline: now + WINDOW_MS }]
  if (match) events.push({ type: 'navigate', id: match })
  return events
}

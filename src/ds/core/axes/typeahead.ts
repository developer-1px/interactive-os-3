import type { Axis } from './axis'
import type { Event } from '../types'
import { getLabel, getTypeahead } from '../types'
import { isPrintable } from '../key'
import { enabledSiblings } from './index'

const WINDOW_MS = 500

export const typeahead: Axis = (d, id, t) => { if (t.kind !== "key") return null; const k = t;
  if (!isPrintable(k)) return null
  const now = Date.now()
  const { buf, deadline } = getTypeahead(d)
  const nextBuf = (now < deadline ? buf : '') + k.key.toLowerCase()
  const match = enabledSiblings(d, id).find((sid) => getLabel(d, sid).toLowerCase().startsWith(nextBuf))
  const events: Event[] = [{ type: 'typeahead', buf: nextBuf, deadline: now + WINDOW_MS }]
  if (match) events.push({ type: 'navigate', id: match })
  return events
}

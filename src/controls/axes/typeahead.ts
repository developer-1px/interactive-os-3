import type { Axis } from '../core/axis'
import type { Event } from '../core/types'
import { getLabel, getTypeahead } from '../core/types'
import { isPrintable } from '../core/key'
import { enabledSiblings } from './index'

const WINDOW_MS = 500

export const typeahead: Axis = (d, id, k) => {
  const printable = isPrintable(k)
  const now = Date.now()
  const { buf, deadline } = getTypeahead(d)
  const nextBuf = printable ? (now < deadline ? buf : '') + k.key.toLowerCase() : ''
  const match = printable
    ? enabledSiblings(d, id).find((sid) => getLabel(d, sid).toLowerCase().startsWith(nextBuf))
    : undefined
  return printable
    ? ([
        { type: 'typeahead', buf: nextBuf, deadline: now + WINDOW_MS },
        ...(match ? [{ type: 'navigate', id: match } as Event] : []),
      ] as Event[])
    : null
}

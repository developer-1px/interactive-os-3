import type { Axis } from './axis'
import type { UiEvent } from '../types'
import { getLabel, getTypeahead } from '../types'
import { isPrintable } from '../key'
import { enabledSiblings } from './index'

const WINDOW_MS = 500

/**
 * typeahead — printable key → 누적 buffer (500ms window) 로 sibling label prefix 매치.
 * `{type:'typeahead', buf, deadline}` 와 매치 시 `{type:'navigate', id}` emit. APG /listbox/ /menu/ /tree/ 의 type-to-search.
 */
export const typeahead: Axis = (d, id, t) => { if (t.kind !== "key") return null; const k = t;
  if (!isPrintable(k)) return null
  const now = Date.now()
  const { buf, deadline } = getTypeahead(d)
  const nextBuf = (now < deadline ? buf : '') + k.key.toLowerCase()
  const match = enabledSiblings(d, id).find((sid) => getLabel(d, sid).toLowerCase().startsWith(nextBuf))
  const events: UiEvent[] = [{ type: 'typeahead', buf: nextBuf, deadline: now + WINDOW_MS }]
  if (match) events.push({ type: 'navigate', id: match })
  return events
}

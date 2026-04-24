import type { Axis } from '../axis'
import { bindAxis } from '../bind'
import { getExpanded, getFocus, type Event, type NormalizedData } from '../types'
import { useFocusBridge } from './focus'

export function useRoving(
  axis: Axis,
  data: NormalizedData,
  onEvent: (e: Event) => void,
) {
  const focusId = getFocus(data)
  const expanded = getExpanded(data)
  const onKey = bindAxis(axis, data, onEvent)
  const bindFocus = useFocusBridge(focusId)
  return { focusId, expanded, onKey, bindFocus }
}

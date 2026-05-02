import { useState } from 'react'
import { reduce, type NormalizedData, type UiEvent } from '@p/headless'

/**
 * Demo helper — wraps NormalizedData in local state and threads events through reduce().
 * Real apps would use a Resource (useResource) instead.
 */
export function useLocalData(initial: NormalizedData | (() => NormalizedData)) {
  const [data, setData] = useState(initial)
  const onEvent = (e: UiEvent) => setData((d) => reduce(d, e))
  return [data, onEvent] as const
}

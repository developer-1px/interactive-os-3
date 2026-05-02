import { useState } from 'react'
import { reduceWithDefaults, type NormalizedData, type Reducer, type UiEvent } from '@p/headless'

/**
 * Demo helper — local state with a pluggable reducer.
 *
 * Default = `reduceWithDefaults` (focus/expand/value/typeahead + single-select).
 * For custom semantics (multi-select, expand-on-activate, etc.) pass a composed
 * reducer:
 *
 *   const myReduce = composeReducers(reduce, multiSelectToggle, setValue)
 *   useLocalData(initial, myReduce)
 */
export function useLocalData(
  initial: NormalizedData | (() => NormalizedData),
  reducer: Reducer = reduceWithDefaults,
) {
  const [data, setData] = useState(initial)
  const onEvent = (e: UiEvent) => setData((d) => reducer(d, e))
  return [data, onEvent] as const
}

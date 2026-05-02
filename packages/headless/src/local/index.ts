/**
 * @p/headless/local — quick-start helpers for local state.
 *
 * Production apps use `useResource` (single data interface, supports HMR /
 * cache / serialize). For demos, prototypes, and isolated examples where you
 * just need `[data, dispatch(event)]` against a NormalizedData, this subpath
 * provides a thin React.useState wrapper.
 *
 * 정체성 분리 — `useResource` 가 정본, 이건 quick-start helper.
 */
import { useState } from 'react'
import type { Reducer } from '../state/compose'
import { reduceWithDefaults } from '../state/defaults'
import type { NormalizedData, UiEvent } from '../types'

export function useLocalData(
  initial: NormalizedData | (() => NormalizedData),
  reducer: Reducer = reduceWithDefaults,
) {
  const [data, setData] = useState(initial)
  const onEvent = (e: UiEvent) => setData((d) => reducer(d, e))
  return [data, onEvent] as const
}

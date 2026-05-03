/**
 * @p/headless/local — quick-start helpers for local state.
 *
 * Production apps use `useResource` (single data interface, supports HMR /
 * cache / serialize). For demos, prototypes, and isolated examples where you
 * just need `[data, dispatch(event)]`, this subpath provides thin React.useState wrappers:
 *
 *  - `useLocalData` — for collections (NormalizedData)
 *  - `useLocalValue<T>` — for single-value controls (slider/switch/spinbutton/...)
 *
 * 정체성 분리 — `useResource` 가 정본, 이건 quick-start helper.
 *
 * cardinality 원칙:
 *  - 컬렉션 (listbox/tree/grid/...) → useLocalData
 *  - 단일값 (slider/switch/spinbutton/splitter) → useLocalValue
 *  - 트리값 → useLocalData (NormalizedData 가 트리를 표현)
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

/** 단일값 dispatch 의 이벤트 모양 — collection UiEvent 의 `value` 변종에서 id 가 빠짐. */
export type ValueEvent<T> = { type: 'value'; value: T }

/**
 * 단일값 컨트롤 (slider/switch/spinbutton/splitter) 의 quick-start state.
 *
 * @example
 *   const [on, dispatch] = useLocalValue(false)
 *   const { switchProps } = toggleSwitchPattern(on, dispatch, { label: 'Mute' })
 */
export function useLocalValue<T>(
  initial: T | (() => T),
): readonly [T, (e: ValueEvent<T>) => void] {
  const [value, setValue] = useState(initial)
  const dispatch = (e: ValueEvent<T>) => {
    if (e.type === 'value') setValue(e.value)
  }
  return [value, dispatch] as const
}

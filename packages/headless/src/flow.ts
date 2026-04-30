import { useMemo } from 'react'
import type { Event, NormalizedData } from './types'
import type { GestureHelper } from './gesture'
import type { Resource } from './data'
import { useResource } from './data'
import { useControlState } from './state/useControlState'
import { useEventBridge } from './state/useEventBridge'

/**
 * Flow — ui/ ↔ resource 사이의 wiring을 1조각으로 묶은 선언형 정의.
 *
 *   raw event ──[gestures]──▶ ┌─ meta (FOCUS/EXPANDED/TYPEAHEAD) → ds dispatch
 *                              └─ intent → resource.onEvent → resource dispatch
 *
 * 라우트는 flow 정의 1개 + `useFlow(flow)` 한 줄. consumer에 분기 코드 0.
 */

const DEFAULT_META_SCOPE: ReadonlyArray<Event['type']> = ['navigate', 'typeahead']

export interface FlowDef<V, Args extends unknown[] = []> {
  /** 진실 원천 — URL/store/in-memory 어느 쪽이든 useResource 단일 인터페이스로 합류. */
  source: Resource<V, Args>
  /** value → NormalizedData. ui가 읽는 base. */
  base: (value: V | undefined) => NormalizedData
  /** raw event → event[] 변환. 기본 = identity. */
  gestures?: GestureHelper
  /** ds-meta로 흘릴 event 종류. base 시드가 owner인 키(예: URL-driven의 EXPANDED)는 제외. */
  metaScope?: ReadonlyArray<Event['type']>
}

export function defineFlow<V, Args extends unknown[] = []>(
  def: FlowDef<V, Args>,
): FlowDef<V, Args> {
  return def
}

const noopGesture: GestureHelper = (_d, e) => [e]

export function useFlow<V, Args extends unknown[] = []>(
  flow: FlowDef<V, Args>,
  ...args: Args
): [NormalizedData, (e: Event) => void] {
  const [value, dispatchValue] = useResource(flow.source, ...args)
  const base = useMemo(() => flow.base(value), [value, flow])
  const [data, dispatchMeta] = useControlState(base)

  const scope = flow.metaScope ?? DEFAULT_META_SCOPE
  const router = flow.source.onEvent
  const onEvent = useEventBridge({
    data,
    gestures: flow.gestures ?? noopGesture,
    dispatchMeta: (e) => { if (scope.includes(e.type)) dispatchMeta(e) },
    onIntent: router
      ? (e) => {
          const next = router(e, { value, data })
          if (next !== undefined) dispatchValue({ type: 'set', value: next })
        }
      : undefined,
  })

  return [data, onEvent]
}

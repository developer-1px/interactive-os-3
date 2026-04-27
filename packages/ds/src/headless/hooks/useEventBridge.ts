import { useCallback } from 'react'
import { type Event, type NormalizedData } from '../types'
import { type GestureHelper } from '../gesture'

/**
 * Event Bridge — ui/ 의 raw onEvent를 두 갈래로 라우팅한다.
 *
 *   ui (data + onEvent)
 *      ↓ raw event
 *   gestures (pure)               ← Event → Event[]
 *      ↓ events
 *   ┌── meta (focus/expand/typeahead) → ds dispatch (자동)
 *   └── intent (activate/navigate/expand/select/value) → onIntent (도메인)
 *
 * 컴포넌트 consumer는 분기 없이 onEvent 한 줄만 받아 ui 에 꽂는다.
 * 도메인 reducer는 Event → Action 매퍼로 onIntent를 받는다 (ds 의존성 0).
 */

const META_TYPES = new Set<Event['type']>(['navigate', 'expand', 'open', 'typeahead'])
const INTENT_TYPES = new Set<Event['type']>([
  'activate', 'navigate', 'expand', 'open', 'select', 'value',
])

const noopGesture: GestureHelper = (_d, e) => [e]

export function useEventBridge({
  data,
  gestures = noopGesture,
  dispatchMeta,
  onIntent,
}: {
  data: NormalizedData
  gestures?: GestureHelper
  dispatchMeta: (e: Event) => void
  onIntent?: (e: Event) => void
}): (raw: Event) => void {
  return useCallback(
    (raw: Event) => {
      for (const e of gestures(data, raw)) {
        if (META_TYPES.has(e.type)) dispatchMeta(e)
        if (INTENT_TYPES.has(e.type)) onIntent?.(e)
      }
    },
    [data, gestures, dispatchMeta, onIntent],
  )
}

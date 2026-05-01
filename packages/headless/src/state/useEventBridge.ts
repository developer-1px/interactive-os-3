import { useCallback } from 'react'
import { type UiEvent, type NormalizedData } from '../types'
import { type GestureHelper } from '../gesture'

/**
 * UiEvent Bridge — ui/ 의 raw onEvent를 두 갈래로 라우팅한다.
 *
 *   ui (data + onEvent)
 *      ↓ raw event
 *   gestures (pure)               ← UiEvent → UiEvent[]
 *      ↓ events
 *   ┌── meta (focus/expand/typeahead) → ds dispatch (자동)
 *   └── intent (activate/navigate/expand/select/value) → onIntent (도메인)
 *
 * 컴포넌트 consumer는 분기 없이 onEvent 한 줄만 받아 ui 에 꽂는다.
 * 도메인 reducer는 UiEvent → Action 매퍼로 onIntent를 받는다 (ds 의존성 0).
 */

const META_TYPES = new Set<UiEvent['type']>(['navigate', 'expand', 'open', 'typeahead'])
const INTENT_TYPES = new Set<UiEvent['type']>([
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
  dispatchMeta: (e: UiEvent) => void
  onIntent?: (e: UiEvent) => void
}): (raw: UiEvent) => void {
  return useCallback(
    (raw: UiEvent) => {
      for (const e of gestures(data, raw)) {
        if (META_TYPES.has(e.type)) dispatchMeta(e)
        if (INTENT_TYPES.has(e.type)) onIntent?.(e)
      }
    },
    [data, gestures, dispatchMeta, onIntent],
  )
}

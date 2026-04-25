import { type RefObject } from 'react'
import { bindAxis } from '../state/bind'
import type { Axis } from '../axis'
import type { Event, NormalizedData } from '../types'
import { useSwipe, type SwipeDir } from './useSwipe'

/**
 * useSwipeAxis — touch swipe를 keyboard/mouse와 동급의 Axis 입력으로 흘려보낸다.
 *  - ref: swipe를 인식할 컨테이너 (보통 useRoving의 collection root와 동일)
 *  - axis: composeAxes(navigate(...), swipe(...), ...)
 *  - data, onEvent, focusId: 일반 axis pipeline
 *  - axes: 인식할 swipe 방향 (기본 vertical orientation은 ['up','down'])
 *
 *  swipe primitive는 group 단위 의도이므로 trigger의 id는 현재 focusId. data에
 *  focus가 없으면 swipe는 no-op (touch는 해도 navigate 결과가 없음).
 */
export interface UseSwipeAxisOpts {
  ref: RefObject<HTMLElement | null>
  axis: Axis
  data: NormalizedData
  onEvent: (e: Event) => void
  focusId: string | undefined
  axes?: SwipeDir[]
}

export function useSwipeAxis({ ref, axis, data, onEvent, focusId, axes }: UseSwipeAxisOpts) {
  useSwipe(ref, {
    axes: axes ?? ['up', 'down'],
    onSwipe: (dir) => {
      if (!focusId) return
      bindAxis(axis, data, onEvent).onSwipe(dir, focusId)
    },
  })
}

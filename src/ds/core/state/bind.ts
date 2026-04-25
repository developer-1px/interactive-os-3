import type { KeyboardEvent, MouseEvent } from 'react'
import type { Axis } from '../axis'
import type { Event, NormalizedData } from '../types'
import type { SwipeDir } from '../hooks/useSwipe'
import { fromKeyboardEvent } from '../key'
import { clickTrigger, keyTrigger, swipeTrigger } from '../trigger'

export interface AxisBindings {
  onKey: (ke: KeyboardEvent, id: string) => boolean
  onClick: (me: MouseEvent, id: string) => boolean
  /** swipe Trigger를 axis에 흘려 보냄. id는 현재 focus(또는 anchor) — swipe는
   *  per-item이 아니라 group 단위 의도이므로 소비자가 focusId를 넣어준다. */
  onSwipe: (dir: SwipeDir, id: string) => boolean
}

export const bindAxis = (
  axis: Axis,
  d: NormalizedData,
  onEvent: (e: Event) => void,
): AxisBindings => ({
  onKey: (ke, id) => {
    const events = axis(d, id, keyTrigger(fromKeyboardEvent(ke)))
    if (!events) return false
    events.forEach(onEvent)
    ke.preventDefault()
    return true
  },
  onClick: (_me, id) => {
    const events = axis(d, id, clickTrigger)
    if (!events) return false
    events.forEach(onEvent)
    return true
  },
  onSwipe: (dir, id) => {
    const events = axis(d, id, swipeTrigger(dir))
    if (!events) return false
    events.forEach(onEvent)
    return true
  },
})

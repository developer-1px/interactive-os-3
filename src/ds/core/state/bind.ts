import type { KeyboardEvent, MouseEvent } from 'react'
import type { Axis } from '../axis'
import type { Event, NormalizedData } from '../types'
import { fromKeyboardEvent } from '../key'
import { clickTrigger, keyTrigger } from '../trigger'

export interface AxisBindings {
  onKey: (ke: KeyboardEvent, id: string) => boolean
  onClick: (me: MouseEvent, id: string) => boolean
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
})

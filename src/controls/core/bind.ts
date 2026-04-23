import type { KeyboardEvent } from 'react'
import type { Axis } from './axis'
import type { Event, NormalizedData } from './types'
import { fromKeyboardEvent } from './key'

export const bindAxis = (
  axis: Axis,
  d: NormalizedData,
  onEvent: (e: Event) => void,
) => (ke: KeyboardEvent, id: string): boolean => {
  const events = axis(d, id, fromKeyboardEvent(ke))
  if (!events) return false
  events.forEach(onEvent)
  ke.preventDefault()
  return true
}

import { getChildren, isDisabled, type Event, type NormalizedData } from '../core/types'
import type { AxisHandler } from './index'

export function createActivate(
  d: NormalizedData,
  onEvent: (e: Event) => void,
): AxisHandler {
  return (e, id) => {
    if (e.key !== 'Enter' && e.key !== ' ') return false
    if (isDisabled(d, id)) return false
    if (getChildren(d, id).length) return false
    onEvent({ type: 'activate', id })
    e.preventDefault()
    return true
  }
}

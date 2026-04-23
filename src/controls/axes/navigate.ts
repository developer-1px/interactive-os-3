import type { NormalizedData, Event } from '../core/types'
import { enabledSiblings, type AxisHandler } from './index'

export function createNavigate(
  d: NormalizedData,
  onEvent: (e: Event) => void,
  orientation: 'vertical' | 'horizontal' = 'vertical',
): AxisHandler {
  const [prev, next] =
    orientation === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
  return (e, id) => {
    const sibs = enabledSiblings(d, id)
    if (!sibs.length) return false
    if (e.key === prev || e.key === next) {
      const i = Math.max(0, sibs.indexOf(id))
      const delta = e.key === next ? 1 : -1
      onEvent({ type: 'navigate', id: sibs[(i + delta + sibs.length) % sibs.length] })
      e.preventDefault()
      return true
    }
    if (e.key === 'Home') {
      onEvent({ type: 'navigate', id: sibs[0] })
      e.preventDefault()
      return true
    }
    if (e.key === 'End') {
      onEvent({ type: 'navigate', id: sibs[sibs.length - 1] })
      e.preventDefault()
      return true
    }
    return false
  }
}

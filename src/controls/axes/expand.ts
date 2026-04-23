import { getChildren, isDisabled, ROOT, type Event, type NormalizedData } from '../core/types'
import { parentOf, type AxisHandler } from './index'

export function createExpand(
  d: NormalizedData,
  onEvent: (e: Event) => void,
): AxisHandler {
  return (e, id) => {
    const kids = getChildren(d, id)
    const isBranch = kids.length > 0
    if (isBranch && !isDisabled(d, id)) {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        onEvent({ type: 'expand', id, open: true })
        const first = kids.find((k) => !isDisabled(d, k))
        if (first) onEvent({ type: 'navigate', id: first })
        e.preventDefault()
        return true
      }
    }
    if (e.key === 'ArrowLeft') {
      const parent = parentOf(d, id)
      if (parent && parent !== ROOT) {
        onEvent({ type: 'expand', id: parent, open: false })
        onEvent({ type: 'navigate', id: parent })
        e.preventDefault()
        return true
      }
    }
    return false
  }
}

import { getChildren, getExpanded, isDisabled, type Event, type NormalizedData } from '../core/types'
import { parentOf, type AxisHandler } from './index'

// APG tree expand semantics:
// ArrowRight: closed branch → open; open branch → first child; leaf → no-op
// ArrowLeft : open branch → close; closed/leaf → parent
// Enter/Space on branch → toggle (leaf handled by createActivate)
export function createTreeExpand(d: NormalizedData, onEvent: (e: Event) => void): AxisHandler {
  return (e, id) => {
    if (isDisabled(d, id)) return false
    const kids = getChildren(d, id)
    const isBranch = kids.length > 0
    const isOpen = getExpanded(d).has(id)

    if (e.key === 'ArrowRight' && isBranch) {
      if (!isOpen) onEvent({ type: 'expand', id, open: true })
      else {
        const first = kids.find((k) => !isDisabled(d, k))
        if (first) onEvent({ type: 'navigate', id: first })
      }
      e.preventDefault()
      return true
    }
    if (e.key === 'ArrowLeft') {
      if (isBranch && isOpen) {
        onEvent({ type: 'expand', id, open: false })
      } else {
        const parent = parentOf(d, id)
        if (parent && !parent.startsWith('__')) onEvent({ type: 'navigate', id: parent })
        else return false
      }
      e.preventDefault()
      return true
    }
    if ((e.key === 'Enter' || e.key === ' ') && isBranch) {
      onEvent({ type: 'expand', id, open: !isOpen })
      e.preventDefault()
      return true
    }
    return false
  }
}

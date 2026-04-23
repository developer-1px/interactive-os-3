import { ROOT, getChildren, getExpanded, isDisabled, type Event, type NormalizedData } from '../core/types'
import type { AxisHandler } from './index'

function visibleFlat(d: NormalizedData, parent: string, expanded: Set<string>, out: string[] = []): string[] {
  for (const id of getChildren(d, parent)) {
    out.push(id)
    if (expanded.has(id)) visibleFlat(d, id, expanded, out)
  }
  return out
}

// APG tree: ArrowUp/Down walk visible flat list (DFS), not siblings.
export function createTreeNavigate(d: NormalizedData, onEvent: (e: Event) => void): AxisHandler {
  const visible = visibleFlat(d, ROOT, getExpanded(d)).filter((id) => !isDisabled(d, id))
  return (e, id) => {
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return false
    const i = visible.indexOf(id)
    if (i < 0) return false
    const next =
      e.key === 'ArrowDown' ? Math.min(visible.length - 1, i + 1) :
      e.key === 'ArrowUp'   ? Math.max(0, i - 1) :
      e.key === 'Home'      ? 0 :
                              visible.length - 1
    if (next !== i) onEvent({ type: 'navigate', id: visible[next] })
    e.preventDefault()
    return true
  }
}

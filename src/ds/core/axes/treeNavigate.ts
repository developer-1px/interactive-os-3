import type { Axis } from '../axis'
import { ROOT, getChildren, getExpanded, isDisabled, type NormalizedData } from '../types'

const visibleFlat = (d: NormalizedData, parent: string, exp: Set<string>, out: string[] = []): string[] => {
  for (const id of getChildren(d, parent)) {
    out.push(id)
    if (exp.has(id)) visibleFlat(d, id, exp, out)
  }
  return out
}

type IndexFn = (len: number, i: number) => number
const TABLE: Partial<Record<string, IndexFn>> = {
  ArrowDown: (len, i) => Math.min(len - 1, i + 1),
  ArrowUp: (_, i) => Math.max(0, i - 1),
  Home: () => 0,
  End: (len) => len - 1,
}

export const treeNavigate: Axis = (d, id, k) => {
  const fn = TABLE[k.key]
  const visible = fn ? visibleFlat(d, ROOT, getExpanded(d)).filter((vid) => !isDisabled(d, vid)) : null
  const i = visible ? visible.indexOf(id) : -1
  return fn && visible && i >= 0
    ? [{ type: 'navigate', id: visible[fn(visible.length, i)] }]
    : null
}

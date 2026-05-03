
import type { Axis } from './axis'
import { ROOT, getChildren, getExpanded, isDisabled, type NormalizedData } from '../types'
import { INTENTS } from './keys'

const visibleFlat = (d: NormalizedData, parent: string, exp: Set<string>, out: string[] = []): string[] => {
  for (const id of getChildren(d, parent)) {
    out.push(id)
    if (exp.has(id)) visibleFlat(d, id, exp, out)
  }
  return out
}

// 키 매핑은 `INTENTS.treeNavigate` + `INTENTS.navigate.start/end` 에서 import (SSOT).
type IndexFn = (len: number, i: number) => number
const TABLE: Partial<Record<string, IndexFn>> = {
  [INTENTS.treeNavigate.next.key]: (len, i) => Math.min(len - 1, i + 1),
  [INTENTS.treeNavigate.prev.key]: (_, i) => Math.max(0, i - 1),
  [INTENTS.navigate.start.key]: () => 0,
  [INTENTS.navigate.end.key]: (len) => len - 1,
}

export const treeNavigate: Axis = (d, id, t) => { if (t.kind !== "key") return null; const k = t;
  const fn = TABLE[k.key]
  const visible = fn ? visibleFlat(d, ROOT, getExpanded(d)).filter((vid) => !isDisabled(d, vid)) : null
  const i = visible ? visible.indexOf(id) : -1
  return fn && visible && i >= 0
    ? [{ type: 'navigate', id: visible[fn(visible.length, i)] }]
    : null
}

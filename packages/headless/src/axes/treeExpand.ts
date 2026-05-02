import type { Axis } from './axis'
import type { UiEvent, NormalizedData } from '../types'
import { ROOT, getChildren, getExpanded, isDisabled, isMetaId } from '../types'
import { parentOf } from './index'

const visibleFlat = (d: NormalizedData, parent: string, exp: Set<string>, out: string[] = []): string[] => {
  for (const id of getChildren(d, parent)) {
    out.push(id)
    if (exp.has(id)) visibleFlat(d, id, exp, out)
  }
  return out
}

/** leaf 에서 ArrowRight → 다음 visible item (de facto: VS Code/Finder). APG 엄격은 do nothing 이지만 키 누르고 있을 때 전체 트리 순회 가능한 흐름이 필요. */
const nextVisibleLeaf = (d: NormalizedData, id: string): UiEvent[] | null => {
  const visible = visibleFlat(d, ROOT, getExpanded(d)).filter((vid) => !isDisabled(d, vid))
  const i = visible.indexOf(id)
  if (i < 0 || i >= visible.length - 1) return null
  return [{ type: 'navigate', id: visible[i + 1] }]
}

type Branch = 'branchClosed' | 'branchOpen' | 'leaf'
type Ctx = { d: NormalizedData; id: string; kids: string[] }
type Action = (c: Ctx) => UiEvent[] | null

const toParentOrNull = (d: NormalizedData, id: string): UiEvent[] | null => {
  const p = parentOf(d, id)
  return p && !isMetaId(p) ? [{ type: 'navigate', id: p }] : null
}
const firstEnabled = (d: NormalizedData, kids: string[]) => kids.find((c) => !isDisabled(d, c))

const TOGGLE: Record<Branch, Action> = {
  branchClosed: ({ id }) => [{ type: 'expand', id, open: true }],
  branchOpen: ({ id }) => [{ type: 'expand', id, open: false }],
  leaf: () => null,
}

const TABLE: Record<string, Record<Branch, Action>> = {
  ArrowRight: {
    branchClosed: ({ id }) => [{ type: 'expand', id, open: true }],
    branchOpen: ({ d, kids }) => {
      const first = firstEnabled(d, kids)
      return first ? [{ type: 'navigate', id: first }] : null
    },
    // leaf: APG 는 do nothing 이나 de facto (VS Code/Finder) 는 다음 visible 로 흐름.
    leaf: ({ d, id }) => nextVisibleLeaf(d, id),
  },
  ArrowLeft: {
    branchClosed: ({ d, id }) => toParentOrNull(d, id),
    branchOpen: ({ id }) => [{ type: 'expand', id, open: false }],
    leaf: ({ d, id }) => toParentOrNull(d, id),
  },
  Enter: TOGGLE,
  ' ': TOGGLE,
}

const classify = (kids: string[], open: boolean): Branch =>
  kids.length === 0 ? 'leaf' : open ? 'branchOpen' : 'branchClosed'

export const treeExpand: Axis = (d, id, t) => { if (t.kind !== "key") return null; const k = t;
  const kids = getChildren(d, id)
  const branch = classify(kids, getExpanded(d).has(id))
  const action = !isDisabled(d, id) ? TABLE[k.key]?.[branch] : undefined
  return action ? action({ d, id, kids }) : null
}

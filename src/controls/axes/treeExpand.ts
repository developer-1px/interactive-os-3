import type { Axis } from '../core/axis'
import type { Event, NormalizedData } from '../core/types'
import { getChildren, getExpanded, isDisabled, isMetaId } from '../core/types'
import { parentOf } from './index'

type Branch = 'branchClosed' | 'branchOpen' | 'leaf'
type Ctx = { d: NormalizedData; id: string; kids: string[] }
type Action = (c: Ctx) => Event[] | null

const toParentOrNull = (d: NormalizedData, id: string): Event[] | null => {
  const p = parentOf(d, id)
  return p && !isMetaId(p) ? [{ type: 'navigate', id: p }] : null
}
const firstEnabled = (d: NormalizedData, kids: string[]) => kids.find((c) => !isDisabled(d, c))

const TABLE: Record<string, Record<Branch, Action>> = {
  ArrowRight: {
    branchClosed: ({ id }) => [{ type: 'expand', id, open: true }],
    branchOpen: ({ d, kids }) => {
      const first = firstEnabled(d, kids)
      return first ? [{ type: 'navigate', id: first }] : null
    },
    leaf: () => null,
  },
  ArrowLeft: {
    branchClosed: ({ d, id }) => toParentOrNull(d, id),
    branchOpen: ({ id }) => [{ type: 'expand', id, open: false }],
    leaf: ({ d, id }) => toParentOrNull(d, id),
  },
  Enter: {
    branchClosed: ({ id }) => [{ type: 'expand', id, open: true }],
    branchOpen: ({ id }) => [{ type: 'expand', id, open: false }],
    leaf: () => null,
  },
}
TABLE[' '] = TABLE.Enter

const classify = (kids: string[], open: boolean): Branch =>
  kids.length === 0 ? 'leaf' : open ? 'branchOpen' : 'branchClosed'

export const treeExpand: Axis = (d, id, k) => {
  const kids = getChildren(d, id)
  const branch = classify(kids, getExpanded(d).has(id))
  const action = !isDisabled(d, id) ? TABLE[k.key]?.[branch] : undefined
  return action ? action({ d, id, kids }) : null
}

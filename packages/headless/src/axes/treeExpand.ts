import { fromKeyMap, type Axis, type KeyHandler } from './axis'
import type { UiEvent, NormalizedData } from '../types'
import { ROOT, getChildren, getExpanded, isDisabled } from '../types'
import { parentOf } from './index'
import { INTENTS } from './keys'
import { visibleEnabled } from './_visibleFlat'

type Branch = 'branchClosed' | 'branchOpen' | 'leaf'

const classify = (kids: string[], open: boolean): Branch =>
  kids.length === 0 ? 'leaf' : open ? 'branchOpen' : 'branchClosed'

const branchAt = (d: NormalizedData, id: string): { branch: Branch; kids: string[] } => {
  const kids = getChildren(d, id)
  return { branch: classify(kids, getExpanded(d).has(id)), kids }
}

const toParentOrNull = (d: NormalizedData, id: string): UiEvent[] | null => {
  const p = parentOf(d, id)
  return p && p !== ROOT ? [{ type: 'navigate', id: p }] : null
}
const firstEnabled = (d: NormalizedData, kids: string[]) => kids.find((c) => !isDisabled(d, c))

/** leaf ArrowRight → 다음 visible item (de facto: VS Code/Finder). */
const nextVisibleLeaf = (d: NormalizedData, id: string): UiEvent[] | null => {
  const v = visibleEnabled(d)
  const i = v.indexOf(id)
  if (i < 0 || i >= v.length - 1) return null
  return [{ type: 'navigate', id: v[i + 1] }]
}

const branchHandler =
  (perBranch: Record<Branch, (d: NormalizedData, id: string, kids: string[]) => UiEvent[] | null>): KeyHandler =>
  (d, id) => {
    if (isDisabled(d, id)) return null
    const { branch, kids } = branchAt(d, id)
    return perBranch[branch](d, id, kids)
  }

/**
 * treeExpand — APG /treeview/ "Right/Left Arrow". branchClosed/branchOpen/leaf 3분기 +
 * nextVisibleLeaf 도출. 일반 open/close 는 expand.
 *
 * KeyMap form — open/close/activate chord 가 KeyHandler 로 매핑되어 branch 분기 처리.
 */
export const treeExpand: Axis = fromKeyMap([
  [INTENTS.treeExpand.open, branchHandler({
    branchClosed: (_d, id) => [{ type: 'expand', id, open: true }],
    branchOpen: (d, _id, kids) => {
      const first = firstEnabled(d, kids)
      return first ? [{ type: 'navigate', id: first }] : null
    },
    // leaf: APG 는 do nothing, de facto 는 다음 visible.
    leaf: (d, id) => nextVisibleLeaf(d, id),
  })],
  [INTENTS.treeExpand.close, branchHandler({
    branchClosed: (d, id) => toParentOrNull(d, id),
    branchOpen: (_d, id) => [{ type: 'expand', id, open: false }],
    leaf: (d, id) => toParentOrNull(d, id),
  })],
  [INTENTS.activate.trigger, branchHandler({
    branchClosed: (_d, id) => [{ type: 'expand', id, open: true }],
    branchOpen: (_d, id) => [{ type: 'expand', id, open: false }],
    leaf: () => null,
  })],
])

import { getExpanded } from '../types'
import { siblingsOf } from '../axes'
import type { Reducer } from './compose'

/**
 * singleExpand — 한 항목이 열리면 같은 부모의 형제는 모두 닫는 reducer fragment.
 * APG accordion 의 single-open invariant.
 *
 * @example
 * composeReducers(reduce, singleExpand)
 */
export const singleExpand: Reducer = (d, e) => {
  if (e.type !== 'expand' || !e.open) return d
  const sibs = siblingsOf(d, e.id).filter((s) => s !== e.id)
  if (sibs.length === 0) return d
  const cur = getExpanded(d)
  const next = [...cur].filter((id) => !sibs.includes(id))
  if (next.length === cur.size) return d
  return {
    ...d,
    meta: { ...d.meta, expanded: next },
  }
}

import { EXPANDED, getExpanded, isMetaId } from '../types'
import { siblingsOf } from '../axes'
import type { Reducer } from './compose'

/**
 * singleExpand — collapses siblings when an entry expands. APG accordion
 * single-open invariant. Compose with `reduce`:
 *   composeReducers(reduce, singleExpand)
 */
export const singleExpand: Reducer = (d, e) => {
  if (e.type !== 'expand' || !e.open || isMetaId(e.id)) return d
  const sibs = siblingsOf(d, e.id).filter((s) => s !== e.id)
  if (sibs.length === 0) return d
  const cur = getExpanded(d)
  const next = [...cur].filter((id) => !sibs.includes(id))
  if (next.length === cur.size) return d
  return {
    ...d,
    entities: { ...d.entities, [EXPANDED]: { id: EXPANDED, data: { ids: next } } },
  }
}

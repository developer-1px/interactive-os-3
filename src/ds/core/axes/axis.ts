import type { Event, NormalizedData } from '../types'
import type { Trigger } from '../trigger'

/**
 * Axis — data 기반 APG 키/포인터 처리 primitive.
 *
 * 입력: data + focus id + Trigger (key 또는 click)
 * 출력: 적용할 Event[] 또는 null(무반응).
 *
 * activate 는 Enter/Space 와 click 모두 반응. 나머지(navigate/expand/typeahead
 * /treeNavigate/treeExpand)는 key 만 반응하고 click 은 바로 null 반환 — 컴포넌트
 * 쪽에서 click 의 focus 이동은 별도 처리한다.
 */
export type Axis = (d: NormalizedData, id: string, t: Trigger) => Event[] | null

export const composeAxes = (...axes: Axis[]): Axis => (d, id, t) => {
  for (const a of axes) {
    const r = a(d, id, t)
    if (r) return r
  }
  return null
}

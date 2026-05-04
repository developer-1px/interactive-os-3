import type { UiEvent, NormalizedData } from '../types'
import type { Trigger } from '../trigger'

/**
 * Axis — data 기반 APG 키/포인터 처리 primitive.
 *
 * 입력: data + focus id + Trigger (key 또는 click)
 * 출력: 적용할 UiEvent[] 또는 null(무반응).
 *
 * activate 는 Enter/Space 와 click 모두 반응. 나머지(navigate/expand/typeahead
 * /treeNavigate/treeExpand)는 key 만 반응하고 click 은 바로 null 반환 — 컴포넌트
 * 쪽에서 click 의 focus 이동은 별도 처리한다.
 */
export type Axis = (d: NormalizedData, id: string, t: Trigger) => UiEvent[] | null

/**
 * composeAxes — 여러 Axis 를 우선순위 순으로 합성. 첫 non-null 반환을 채택, 나머지 axis 는 단락(short-circuit).
 *
 * 같은 키를 두 axis 가 다루면 앞쪽이 이긴다 (예: treeExpand 가 Space 를 흡수해야 activate 가 leaf 에서만 발화).
 *
 * @example
 *   const onKey = composeAxes(treeExpand, treeNavigate, typeahead, activate)
 *   const events = onKey(data, focusId, { kind: 'key', key: 'ArrowRight' })
 */
export const composeAxes = (...axes: Axis[]): Axis => (d, id, t) => {
  for (const a of axes) {
    const r = a(d, id, t)
    if (r) return r
  }
  return null
}

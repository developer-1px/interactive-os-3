import { getChildren, getExpanded, type Event, type NormalizedData } from './types'

// 제스처(activate) → 의도(expand/navigate) 변환 헬퍼.
// ui/ role은 activate 단발만 emit. 소비자가 자기 reducer 직전에 골라 통과시킨다.
//
// 키보드 axes(composeAxes)와 대칭: 마우스/터치/Enter 모두 activate로 합류 →
// 같은 헬퍼가 의도 이벤트로 분해.

export type GestureHelper = (d: NormalizedData, e: Event) => Event[]

// 활성화 시 포커스도 함께 이동 (selection-follows-focus / click-sets-focus).
export const navigateOnActivate: GestureHelper = (_d, e) =>
  e.type === 'activate' ? [{ type: 'navigate', id: e.id }, e] : [e]

// 포커스 이동 시 활성화도 함께 발행 — APG single-select listbox/tabs 기본 동작
// "selection follows focus": ↑↓로 옵션 옮기면 즉시 선택까지 이동.
// disabled 옵션엔 발행하지 않는다 (focus만 통과시키고 활성화는 skip).
export const activateOnNavigate: GestureHelper = (d, e) => {
  if (e.type !== 'navigate') return [e]
  const ent = d.entities[e.id]
  if (ent?.data?.disabled) return [e]
  return [e, { type: 'activate', id: e.id }]
}

// 자식이 있으면 expand 토글, 없으면 활성화 그대로.
// Tree/Columns/Menu 등 펼침 가능한 role.
export const expandBranchOnActivate: GestureHelper = (d, e) => {
  if (e.type !== 'activate') return [e]
  const hasKids = getChildren(d, e.id).length > 0
  if (!hasKids) return [{ type: 'navigate', id: e.id }, e]
  const open = getExpanded(d).has(e.id)
  return [{ type: 'navigate', id: e.id }, { type: 'expand', id: e.id, open: !open }]
}

// 헬퍼 조합. 왼쪽부터 차례로 통과.
export const composeGestures = (...fns: GestureHelper[]): GestureHelper =>
  (d, e) => fns.reduce<Event[]>((evs, fn) => evs.flatMap((ev) => fn(d, ev)), [e])

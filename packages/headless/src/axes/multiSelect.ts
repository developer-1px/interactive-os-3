import type { Axis } from './axis'
import type { UiEvent } from '../types'
import { enabledSiblings } from './index'

/**
 * multiSelect — `aria-multiselectable` 패턴 axis. Shift+Arrow 로 선택 범위 확장,
 * Ctrl/Meta+Click 단일 토글, Space 토글, Ctrl+A 전체 선택.
 *
 * 발행 이벤트:
 *   - 단일 토글: `{type: 'select', id}` (소비자 reducer 가 multi 모드일 때 토글 적용)
 *   - 범위 확장: `{type: 'navigate', id} + {type: 'select', id}` (Shift+Arrow 로 anchor 사이 채움은 reducer 책임)
 *
 * APG: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/  (Selection 섹션)
 *
 * 단순 axis — 복잡한 anchor/range 추적은 reducer 가 담당. axis 는 키→intent 매핑만.
 */
export const multiSelect: Axis = (d, id, t) => {
  if (t.kind === 'click') {
    if (t.kind === 'click') return null // click의 toggle은 gesture/component에서 처리
    return null
  }
  if (t.kind !== 'key') return null

  // Space 토글
  if (t.key === ' ' || t.key === 'Spacebar') {
    return [{ type: 'select', id }]
  }

  // Ctrl/Meta + A 전체 선택 — 모든 enabled sibling 에 대해 select 발행
  if ((t.ctrl || t.meta) && (t.key === 'a' || t.key === 'A')) {
    const ids = enabledSiblings(d, id)
    return ids.map((sid): UiEvent => ({ type: 'select', id: sid }))
  }

  // Shift + Arrow — 다음 sibling 으로 navigate + select (anchor 추적은 reducer)
  if (t.shift && (t.key === 'ArrowDown' || t.key === 'ArrowUp')) {
    const ids = enabledSiblings(d, id)
    const idx = ids.indexOf(id)
    if (idx < 0) return null
    const nextIdx = t.key === 'ArrowDown' ? idx + 1 : idx - 1
    if (nextIdx < 0 || nextIdx >= ids.length) return null
    const nextId = ids[nextIdx]
    return [
      { type: 'navigate', id: nextId },
      { type: 'select', id: nextId },
    ]
  }

  return null
}

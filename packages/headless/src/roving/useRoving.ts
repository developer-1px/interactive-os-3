import type { KeyboardEvent, MouseEvent } from 'react'
import type { Axis } from '../axes'
import { bindAxis } from '../state/bind'
import { getExpanded, getFocus, type Event, type NormalizedData } from '../types'
import { useFocusBridge } from '../focus'

// rovingItem 기본기: data-id 기반 이벤트 위임을 hook 내부에서 소유한다.
// 소비자는 {...delegate}를 container에 그대로 꽂기만 하면 axis로 연결된다.
// onKey/onClick 은 Menu 처럼 직접 합성이 필요한 경우를 위해 그대로 노출.
const idFrom = (e: { target: EventTarget }): string | null =>
  (e.target as Element).closest<HTMLElement>('[data-id]')?.dataset.id ?? null

export function useRoving(
  axis: Axis,
  data: NormalizedData,
  onEvent: (e: Event) => void,
  options: { autoFocus?: boolean } = {},
) {
  const focusId = getFocus(data)
  const expanded = getExpanded(data)
  const { onKey, onClick } = bindAxis(axis, data, onEvent)
  const bindFocus = useFocusBridge(focusId, options.autoFocus)

  const delegate = {
    onClick: (e: MouseEvent) => {
      const id = idFrom(e)
      if (id) onClick(e, id)
    },
    onKeyDown: (e: KeyboardEvent) => {
      const id = idFrom(e)
      if (id) onKey(e, id)
    },
  }

  return { focusId, expanded, bindFocus, delegate, onKey, onClick }
}

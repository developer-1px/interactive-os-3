import { useEffect, type RefObject } from 'react'

/**
 * useActiveDescendant — Combobox / Grid 등 INVARIANT B11 ("포커스는 실제 DOM element 에 있다 —
 * `aria-activedescendant` 는 Combobox 1곳 예외") 의 코드화.
 *
 * 입력 element(보통 input)에 DOM focus 를 유지하면서, popup option 의 활성 상태를
 * id 참조(`aria-activedescendant`)로만 표현. roving tabindex 와 다른 모드.
 *
 * W3C ARIA: https://www.w3.org/TR/wai-aria-1.2/#aria-activedescendant
 */
export function useActiveDescendant<T extends HTMLElement>(
  ref: RefObject<T | null>,
  activeId: string | null | undefined,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (activeId) el.setAttribute('aria-activedescendant', activeId)
    else el.removeAttribute('aria-activedescendant')
  }, [ref, activeId])
}

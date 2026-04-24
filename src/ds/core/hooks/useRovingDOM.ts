import { useCallback, useRef, type KeyboardEvent, type MouseEvent, type RefObject } from 'react'

/**
 * useRovingDOM — children 자유 JSX 컴포넌트(Toolbar/Tabs/Menubar 등)의 APG roving focus.
 *
 * data-based useRoving 과 달리 ref 안의 tabbable 엘리먼트들을 DOM 으로 순회.
 * Arrow/Home/End 로 focus 이동. Enter/Space/click 은 네이티브 버튼이 처리하므로
 * 여기서는 네비게이션만 담당 (activate 는 개별 button 이 알아서).
 *
 *   const ref = useRef<HTMLDivElement>(null)
 *   const { onKeyDown } = useRovingDOM(ref, { orientation: 'horizontal' })
 *   return <div role="toolbar" ref={ref} onKeyDown={onKeyDown}>...</div>
 */

const TABBABLE =
  'button:not([disabled]):not([tabindex="-2"]),[tabindex]:not([tabindex="-1"]):not([tabindex="-2"]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])'

export interface UseRovingDOMOptions {
  orientation?: 'horizontal' | 'vertical' | 'both'
  /** true면 Home/End 지원 (default: true) */
  homeEnd?: boolean
  /** true면 양 끝에서 순환 (default: true) */
  wrap?: boolean
}

export function useRovingDOM<T extends HTMLElement = HTMLDivElement>(
  externalRef?: RefObject<T | null> | null,
  { orientation = 'horizontal', homeEnd = true, wrap = true }: UseRovingDOMOptions = {},
) {
  const ownRef = useRef<T>(null)
  const effectiveRef = externalRef ?? ownRef

  const onKeyDown = useCallback((e: KeyboardEvent<T>) => {
    const root = effectiveRef.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>(TABBABLE))
    if (items.length === 0) return
    const active = document.activeElement as HTMLElement | null
    const idx = active ? items.indexOf(active) : -1

    const PREV =
      orientation === 'horizontal' ? 'ArrowLeft' :
      orientation === 'vertical'   ? 'ArrowUp'   : null
    const NEXT =
      orientation === 'horizontal' ? 'ArrowRight' :
      orientation === 'vertical'   ? 'ArrowDown'  : null

    const prevKeys = orientation === 'both' ? ['ArrowLeft', 'ArrowUp']   : PREV ? [PREV] : []
    const nextKeys = orientation === 'both' ? ['ArrowRight', 'ArrowDown'] : NEXT ? [NEXT] : []

    let target: HTMLElement | null = null
    if (prevKeys.includes(e.key)) {
      target = items[wrap ? (idx - 1 + items.length) % items.length : Math.max(0, idx - 1)]
    } else if (nextKeys.includes(e.key)) {
      target = items[wrap ? (idx + 1) % items.length : Math.min(items.length - 1, idx + 1)]
    } else if (homeEnd && e.key === 'Home') {
      target = items[0]
    } else if (homeEnd && e.key === 'End') {
      target = items[items.length - 1]
    }
    if (target) {
      e.preventDefault()
      target.focus()
    }
  }, [effectiveRef, orientation, homeEnd, wrap])

  const onClick = useCallback((_e: MouseEvent<T>) => {
    // 네이티브 button/input 이 각자 activate 를 담당. 여기서는 no-op.
  }, [])

  return { onKeyDown, onClick, ref: effectiveRef }
}

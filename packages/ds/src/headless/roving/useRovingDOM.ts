import { useEffect, useRef, type KeyboardEvent, type RefObject } from 'react'

/**
 * useRovingDOM — children 자유 JSX 컴포넌트(Toolbar/Tabs/Menubar 등)의 APG roving focus.
 * DOM 으로 tabbable 순회 + roving tabindex 자동 관리 (그룹에 Tab stop 1개).
 * Arrow/Home/End 네비게이션. Enter/Space/click 은 네이티브 버튼이 활성화.
 */

// 기본 selector — Toolbar/Tabs/Menubar 처럼 자연 tabbable(button) 묶음용.
// TreeGrid/Listbox 처럼 selected 외 전부 tabindex=-1 인 그룹은 itemSelector 옵션으로
// 명시 (예: '[role="row"]'). tabindex=-1 도 발견되어야 그룹 normalize 가 가능.
const TABBABLE =
  'button:not([disabled]):not([tabindex="-2"]),[tabindex]:not([tabindex="-1"]):not([tabindex="-2"]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])'

export interface UseRovingDOMOptions {
  orientation?: 'horizontal' | 'vertical' | 'both'
  homeEnd?: boolean
  wrap?: boolean
  /** 명시적 item 셀렉터. tabindex=-1 도 포함해서 발견 가능 (TreeGrid/Listbox 류). */
  itemSelector?: string
}

export function useRovingDOM<T extends HTMLElement = HTMLDivElement>(
  externalRef?: RefObject<T | null> | null,
  { orientation = 'horizontal', homeEnd = true, wrap = true, itemSelector }: UseRovingDOMOptions = {},
) {
  const ownRef = useRef<T>(null)
  const effectiveRef = externalRef ?? ownRef
  const selector = itemSelector ?? TABBABLE

  useEffect(() => {
    const root = effectiveRef.current
    if (!root) return
    const snap = () => Array.from(root.querySelectorAll<HTMLElement>(selector))
    const items = snap()
    if (items.length > 0 && !items.some((el) => el.tabIndex === 0)) items[0].tabIndex = 0
    items.forEach((el) => { if (el.tabIndex !== 0) el.tabIndex = -1 })
    const handler = (ev: FocusEvent) => {
      const list = snap()
      const t = ev.target as HTMLElement
      if (!list.includes(t)) return
      list.forEach((el) => { el.tabIndex = el === t ? 0 : -1 })
    }
    root.addEventListener('focusin', handler)
    return () => root.removeEventListener('focusin', handler)
  }, [effectiveRef])

  const onKeyDown = (e: KeyboardEvent<T>) => {
    const root = effectiveRef.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>(selector))
    if (items.length === 0) return
    const idx = items.indexOf(document.activeElement as HTMLElement)
    const prevKeys = orientation === 'horizontal' ? ['ArrowLeft'] : orientation === 'vertical' ? ['ArrowUp'] : ['ArrowLeft', 'ArrowUp']
    const nextKeys = orientation === 'horizontal' ? ['ArrowRight'] : orientation === 'vertical' ? ['ArrowDown'] : ['ArrowRight', 'ArrowDown']
    let target: HTMLElement | null = null
    if (prevKeys.includes(e.key)) target = items[wrap ? (idx - 1 + items.length) % items.length : Math.max(0, idx - 1)]
    else if (nextKeys.includes(e.key)) target = items[wrap ? (idx + 1) % items.length : Math.min(items.length - 1, idx + 1)]
    else if (homeEnd && e.key === 'Home') target = items[0]
    else if (homeEnd && e.key === 'End') target = items[items.length - 1]
    if (target) { e.preventDefault(); target.focus() }
  }

  return { onKeyDown, ref: effectiveRef }
}

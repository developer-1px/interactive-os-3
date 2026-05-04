import { useEffect, useRef, useState, type RefObject } from 'react'
import { KEYS } from '../axes/keys'
import type { ItemProps, RootProps } from './types'

/**
 * Dialog 가 실제 등록하는 키 — SSOT.
 * Escape: 닫기. Tab: focus-trap (modal=true 에서만, axis 아님 → 직접 표기).
 */
export const dialogKeys = (opts: { modal?: boolean } = {}) =>
  (opts.modal ?? true) ? [KEYS.Escape, KEYS.Tab] : [KEYS.Escape]

/** Options for {@link useDialogPattern}. */
export interface DialogOptions {
  /** controlled. 생략 시 패턴이 useState 로 자체 소유 (uncontrolled). */
  open?: boolean
  /** uncontrolled 초기값. */
  defaultOpen?: boolean
  /** controlled 통지 + uncontrolled 에서도 호출 (양 모드 공통 콜백). */
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  /** APG `alertdialog` 변종 — role 만 다르고 동작 동일. */
  alert?: boolean
  /** focus 복귀 대상. trigger element ref 권장. */
  returnFocusRef?: RefObject<HTMLElement | null>
  /** open 직후 우선 focus 대상. 없으면 첫 focusable, 그것도 없으면 dialog root. */
  initialFocusRef?: RefObject<HTMLElement | null>
  returnFocus?: boolean
  /** aria-label — ARIA: dialog/alertdialog requires accessible name. */
  label?: string
  labelledBy?: string
  describedBy?: string
  /** 외부에서 root ref 를 제어해야 할 때 주입. 미주입 시 내부 ref 생성. */
  rootRef?: RefObject<HTMLElement | null>
}

const FOCUSABLE_SELECTOR =
  [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'audio[controls]',
    'video[controls]',
    '[contenteditable="true"]',
    'summary',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

/**
 * dialog — APG `/dialog-modal/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * 동작: open 시 첫 focusable 에 focus, Escape 닫기, 닫힘 시 trigger 로 focus
 * 복귀, modal 일 때 Tab 이 dialog 내부에서 순환 (focus trap).
 */
export function useDialogPattern(opts: DialogOptions = {}): {
  rootRef: RefObject<HTMLElement | null>
  rootProps: RootProps
  closeProps: ItemProps
  open: boolean
  setOpen: (open: boolean) => void
} {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    modal = true,
    alert = false,
    returnFocusRef,
    initialFocusRef,
    returnFocus = true,
    label,
    labelledBy,
    describedBy,
  } = opts
  const internalRootRef = useRef<HTMLElement | null>(null)
  const rootRef = opts.rootRef ?? internalRootRef
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : internalOpen
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    const root = rootRef.current
    if (!root) return
    const active = document.activeElement
    previousFocusRef.current = active instanceof HTMLElement ? active : null
    const first = initialFocusRef?.current ?? root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? root
    first.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KEYS.Escape) {
        e.preventDefault()
        setOpen(false)
        return
      }
      // Tab focus trap (modal only)
      if (modal && e.key === KEYS.Tab) {
        const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        if (!focusables.length) {
          e.preventDefault()
          return
        }
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null
        if (e.shiftKey && (active === first || !root.contains(active))) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && (active === last || !root.contains(active))) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (!returnFocus) return
      const target = returnFocusRef?.current ?? previousFocusRef.current
      if (target && document.contains(target)) target.focus({ preventScroll: true })
    }
  }, [open, rootRef, onOpenChange, returnFocusRef, initialFocusRef, returnFocus, modal])

  const rootProps: RootProps = {
    role: alert ? 'alertdialog' : 'dialog',
    'aria-modal': modal,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    ref: rootRef as React.Ref<HTMLElement>,
    tabIndex: -1,
    hidden: !open,
    'data-state': open ? 'open' : 'closed',
  } as unknown as RootProps

  const closeProps: ItemProps = {
    type: 'button',
    onClick: () => setOpen(false),
  } as unknown as ItemProps

  return { rootRef, rootProps, closeProps, open, setOpen }
}

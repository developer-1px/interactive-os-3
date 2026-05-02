import { useEffect, type RefObject } from 'react'
import type { ItemProps, RootProps } from './types'

export interface DialogOptions {
  open: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  /** APG `alertdialog` 변종 — role 만 다르고 동작 동일. */
  alert?: boolean
  /** focus 복귀 대상. trigger element ref 권장. */
  returnFocusRef?: RefObject<HTMLElement | null>
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]),[tabindex]:not([tabindex="-1"]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])'

/**
 * dialog — APG `/dialog-modal/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * 동작: open 시 첫 focusable 에 focus, Escape 닫기, 닫힘 시 trigger 로 focus
 * 복귀, modal 일 때 Tab 이 dialog 내부에서 순환 (focus trap).
 */
export function useDialogPattern(
  rootRef: RefObject<HTMLElement | null>,
  opts: DialogOptions,
): {
  rootProps: RootProps
  closeProps: ItemProps
} {
  const { open, onOpenChange, modal = true, alert = false, returnFocusRef, ariaLabel, ariaLabelledBy, ariaDescribedBy } = opts

  useEffect(() => {
    if (!open) return
    const root = rootRef.current
    if (!root) return
    const first = root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onOpenChange?.(false)
        return
      }
      // Tab focus trap (modal only)
      if (modal && e.key === 'Tab') {
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
      returnFocusRef?.current?.focus()
    }
  }, [open, rootRef, onOpenChange, returnFocusRef, modal])

  const rootProps: RootProps = {
    role: alert ? 'alertdialog' : 'dialog',
    'aria-modal': modal,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ref: rootRef as React.Ref<HTMLElement>,
    hidden: !open,
    'data-state': open ? 'open' : 'closed',
  } as unknown as RootProps

  const closeProps: ItemProps = {
    'aria-label': 'Close',
    onClick: () => onOpenChange?.(false),
  } as unknown as ItemProps

  return { rootProps, closeProps }
}

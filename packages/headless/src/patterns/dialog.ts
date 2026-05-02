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

/**
 * dialog — APG `/dialog-modal/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * 동작: open 시 첫 focusable 에 focus, Escape 닫기, 닫힘 시 trigger 로 focus 복귀.
 * focus trap 은 native `<dialog>` 또는 [inert] 사용 권장 — 본 recipe 는 보조.
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
    // open: focus first focusable
    const first = root.querySelector<HTMLElement>(
      'button:not([disabled]),[tabindex]:not([tabindex="-1"]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])',
    )
    first?.focus()
    // Escape close
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onOpenChange?.(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      // close: return focus
      returnFocusRef?.current?.focus()
    }
  }, [open, rootRef, onOpenChange, returnFocusRef])

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

import type { RefObject } from 'react'
import { useDialogPattern, type DialogOptions } from './dialog'
import type { ItemProps, RootProps } from './types'

/** Options for {@link useAlertDialogPattern}. */
export type AlertDialogOptions = Omit<DialogOptions, 'alert'> & {
  /**
   * cancel/dismiss action 의 ref. open 시 자동 focus 우선 대상 (`initialFocusRef`
   * 가 따로 주어지지 않은 경우). 파괴적 동작 (Confirm) 보다 안전한 기본 focus.
   */
  cancelRef?: RefObject<HTMLElement | null>
}

/**
 * alert-dialog — APG `/alertdialog/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 *
 * `useDialogPattern` 의 preset — `role="alertdialog"` + cancel 버튼 자동 focus.
 * confirm/destructive prompt 에 사용.
 */
export function useAlertDialogPattern(opts: AlertDialogOptions = {}): {
  rootRef: RefObject<HTMLElement | null>
  rootProps: RootProps
  closeProps: ItemProps
  open: boolean
  setOpen: (open: boolean) => void
} {
  const { cancelRef, initialFocusRef, ...rest } = opts
  return useDialogPattern({
    ...rest,
    alert: true,
    initialFocusRef: initialFocusRef ?? cancelRef,
  })
}

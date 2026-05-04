import type { RootProps } from './types'

/**
 * alert — ARIA `alert` role.
 * https://www.w3.org/TR/wai-aria-1.2/#alert
 *
 * 즉시 announce. live region 자동 (role=alert 가 aria-live=assertive 묵시).
 */
export function alertPattern(): { rootProps: RootProps } {
  return { rootProps: { role: 'alert' } as RootProps }
}

/** Options for {@link alertdialogPattern}. */
export interface AlertdialogOptions {
  /** aria-label — ARIA: alertdialog requires accessible name. */
  label?: string
  labelledBy?: string
  describedBy?: string
}

/**
 * alertdialog — APG `/alertdialog/`.
 * https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 *
 * dialog 변종 — 즉시 주의 필요. role=alertdialog. focus trap 등 동작은 useDialogPattern 사용.
 * 본 함수는 declarative props 만 — 행동까지 필요하면 `useDialogPattern({ alert: true })`.
 */
export function alertdialogPattern(opts: AlertdialogOptions = {}): { rootProps: RootProps } {
  const { label, labelledBy, describedBy } = opts
  return {
    rootProps: {
      role: 'alertdialog',
      'aria-modal': true,
      'aria-label': label,
      'aria-labelledby': labelledBy,
      'aria-describedby': describedBy,
    } as unknown as RootProps,
  }
}

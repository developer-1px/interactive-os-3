import type { RootProps } from './types'

/**
 * alert — ARIA `alert` role.
 * https://www.w3.org/TR/wai-aria-1.2/#alert
 *
 * 즉시 announce. live region 자동 (role=alert 가 aria-live=assertive 묵시).
 */
export function alert(): { rootProps: RootProps } {
  return { rootProps: { role: 'alert' } as RootProps }
}

/**
 * alertdialog — APG `/alertdialog/`.
 * https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 *
 * dialog 변종 — 즉시 주의 필요. role=alertdialog. 나머지는 dialog recipe 와 동일.
 */
export function alertdialog(): { rootProps: RootProps } {
  return {
    rootProps: { role: 'alertdialog', 'aria-modal': true } as unknown as RootProps,
  }
}

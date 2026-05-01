import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type CalloutTone = 'info' | 'success' | 'warning' | 'danger'

type CalloutProps = ComponentPropsWithoutRef<'aside'> & {
  variant?: CalloutTone
  /** Legacy alias. Prefer variant. */
  tone?: CalloutTone
  children: ReactNode
}

/**
 * Callout — info/success/warning/danger 메시지 박스.
 * warning/danger는 role="alert", 그 외는 role="status".
 */
export function Callout({ variant, tone, children, ...rest }: CalloutProps) {
  const resolved = variant ?? tone ?? 'info'
  const role = resolved === 'warning' || resolved === 'danger' ? 'alert' : 'status'
  return (
    <aside
      // eslint-disable-next-line no-restricted-syntax
      role={role}
      data-part="callout"
      data-variant={resolved}
      {...rest}
    >
      {children}
    </aside>
  )
}

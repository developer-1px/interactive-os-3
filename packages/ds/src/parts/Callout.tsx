import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type CalloutTone = 'info' | 'success' | 'warning' | 'danger'

type CalloutProps = ComponentPropsWithoutRef<'aside'> & {
  tone?: CalloutTone
  children: ReactNode
}

/**
 * Callout — info/success/warning/danger 메시지 박스.
 * warning/danger는 role="alert", 그 외는 role="status".
 */
export function Callout({ tone = 'info', children, ...rest }: CalloutProps) {
  const role = tone === 'warning' || tone === 'danger' ? 'alert' : 'status'
  return (
    <aside
      // eslint-disable-next-line no-restricted-syntax
      role={role}
      data-part="callout"
      data-tone={tone}
      {...rest}
    >
      {children}
    </aside>
  )
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type Flow = 'list' | 'cluster' | 'form' | 'prose' | 'split'
export type Emphasis = 'flat' | 'raised' | 'sunk' | 'callout'

export type RowProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  flow?: Flow
  emphasis?: Emphasis
  children?: ReactNode
}

/**
 * Horizontal flex container. Classless — styled by [data-ds="Row"].
 * `role="group"` is only applied when the consumer provides an accessible name
 * (aria-label or aria-labelledby), avoiding the nameless-group trap.
 */
export function Row({ flow, emphasis, children, ...rest }: RowProps) {
  const hasName = Boolean(rest['aria-label'] || rest['aria-labelledby'])
  return (
    <div
      data-ds="Row"
      data-flow={flow}
      data-emphasis={emphasis}
      role={hasName ? 'group' : undefined}
      {...rest}
    >
      {children}
    </div>
  )
}

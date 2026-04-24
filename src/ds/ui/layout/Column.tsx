import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { Emphasis, Flow } from './Row'

export type ColumnProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  flow?: Flow
  emphasis?: Emphasis
  children?: ReactNode
}

/**
 * Vertical flex container. Classless — styled by [data-ds="Column"].
 * `role="group"` is only applied when the consumer provides an accessible name.
 */
export function Column({ flow, emphasis, children, ...rest }: ColumnProps) {
  const hasName = Boolean(rest['aria-label'] || rest['aria-labelledby'])
  return (
    <div
      data-ds="Column"
      data-flow={flow}
      data-emphasis={emphasis}
      role={hasName ? 'group' : undefined}
      {...rest}
    >
      {children}
    </div>
  )
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { Emphasis, Flow } from './Row'

export type GridCols = 1 | 2 | 3 | 4 | 6 | 12

export type GridProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  cols?: GridCols
  flow?: Flow
  emphasis?: Emphasis
  children?: ReactNode
}

/**
 * N-column grid container. Classless — styled by [data-ds="Grid"][data-cols="…"].
 * `role="group"` is only applied when the consumer provides an accessible name.
 * No raw template-string escape hatch — pick one of 1 | 2 | 3 | 4 | 6 | 12.
 */
export function Grid({ cols, flow, emphasis, children, ...rest }: GridProps) {
  const hasName = Boolean(rest['aria-label'] || rest['aria-labelledby'])
  return (
    <div
      data-ds="Grid"
      data-cols={cols}
      data-flow={flow}
      data-emphasis={emphasis}
      role={hasName ? 'group' : undefined}
      {...rest}
    >
      {children}
    </div>
  )
}

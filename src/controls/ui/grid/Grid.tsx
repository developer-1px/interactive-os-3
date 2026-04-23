import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type GridProps = Omit<ComponentPropsWithoutRef<'table'>, 'role'> & {
  children: ReactNode
}

export function Grid({ children, ...rest }: GridProps) {
  return (
    <table role="grid" {...rest}>
      {children}
    </table>
  )
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — composable (wrapper/label/subpart)
type TreeGridProps = Omit<ComponentPropsWithoutRef<'table'>, 'role'> & {
  children: ReactNode
}

export function TreeGrid({ children, ...rest }: TreeGridProps) {
  return (
    <table role="treegrid" {...rest}>
      {children}
    </table>
  )
}

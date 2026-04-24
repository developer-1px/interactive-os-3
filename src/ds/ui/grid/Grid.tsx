import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — composable (wrapper/label/subpart)
type DataGridProps = Omit<ComponentPropsWithoutRef<'table'>, 'role'> & {
  children: ReactNode
}

export function DataGrid({ children, ...rest }: DataGridProps) {
  return (
    <table role="grid" {...rest}>
      {children}
    </table>
  )
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

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

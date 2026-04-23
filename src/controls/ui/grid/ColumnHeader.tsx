import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ColumnHeaderProps = Omit<ComponentPropsWithoutRef<'th'>, 'role'> & {
  sort?: 'ascending' | 'descending' | 'none' | 'other'
  children: ReactNode
}

export function ColumnHeader({ sort, children, ...rest }: ColumnHeaderProps) {
  return (
    <th role="columnheader" aria-sort={sort} {...rest}>
      {children}
    </th>
  )
}

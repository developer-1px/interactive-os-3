import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type RowHeaderProps = Omit<ComponentPropsWithoutRef<'th'>, 'role'> & {
  children: ReactNode
}

export function RowHeader({ children, ...rest }: RowHeaderProps) {
  return (
    <th role="rowheader" scope="row" {...rest}>
      {children}
    </th>
  )
}

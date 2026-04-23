import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type RowGroupProps = Omit<ComponentPropsWithoutRef<'tbody'>, 'role'> & {
  children: ReactNode
}

export function RowGroup({ children, ...rest }: RowGroupProps) {
  return (
    <tbody role="rowgroup" {...rest}>
      {children}
    </tbody>
  )
}

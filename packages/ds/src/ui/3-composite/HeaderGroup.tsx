import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — composable (wrapper/label/subpart)
type HeaderGroupProps = Omit<ComponentPropsWithoutRef<'thead'>, 'role'> & {
  children: ReactNode
}

export function HeaderGroup({ children, ...rest }: HeaderGroupProps) {
  return (
    <thead role="rowgroup" {...rest}>
      {children}
    </thead>
  )
}

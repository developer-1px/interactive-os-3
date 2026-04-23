import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type MenuListProps = Omit<ComponentPropsWithoutRef<'ul'>, 'role'> & {
  children: ReactNode
}

export function MenuList({ children, ...rest }: MenuListProps) {
  return (
    <ul role="menu" {...rest}>
      {children}
    </ul>
  )
}

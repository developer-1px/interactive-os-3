import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type MenubarProps = Omit<ComponentPropsWithoutRef<'ul'>, 'role'> & {
  children: ReactNode
}

export function Menubar({ children, ...rest }: MenubarProps) {
  return (
    <ul role="menubar" {...rest}>
      {children}
    </ul>
  )
}

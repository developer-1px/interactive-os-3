import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ToolbarProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
}

export function Toolbar({ orientation, children, ...rest }: ToolbarProps) {
  return (
    <div role="toolbar" aria-orientation={orientation} {...rest}>
      {children}
    </div>
  )
}

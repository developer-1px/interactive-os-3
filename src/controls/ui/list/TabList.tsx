import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type TabListProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
}

export function TabList({ orientation, children, ...rest }: TabListProps) {
  return (
    <div role="tablist" aria-orientation={orientation} {...rest}>
      {children}
    </div>
  )
}

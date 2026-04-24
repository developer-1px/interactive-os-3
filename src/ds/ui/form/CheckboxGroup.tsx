import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type CheckboxGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
}

export function CheckboxGroup({ orientation, children, ...rest }: CheckboxGroupProps) {
  return (
    <div role="group" aria-orientation={orientation} {...rest}>
      {children}
    </div>
  )
}

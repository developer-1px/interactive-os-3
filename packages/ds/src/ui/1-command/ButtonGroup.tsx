import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ButtonGroupProps = ComponentPropsWithoutRef<'div'> & {
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
}

export function ButtonGroup({ orientation = 'horizontal', children, ...rest }: ButtonGroupProps) {
  return (
    <div role="group" data-part="button-group" data-orientation={orientation} {...rest}>
      {children}
    </div>
  )
}

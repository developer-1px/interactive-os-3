import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type RadioGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
}

export function RadioGroup({ orientation, children, ...rest }: RadioGroupProps) {
  return (
    <div role="radiogroup" aria-orientation={orientation} {...rest}>
      {children}
    </div>
  )
}

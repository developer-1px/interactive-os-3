import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type TabPanelProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  labelledBy?: string
  children: ReactNode
}

export function TabPanel({ labelledBy, children, ...rest }: TabPanelProps) {
  return (
    <div role="tabpanel" aria-labelledby={labelledBy} tabIndex={0} {...rest}>
      {children}
    </div>
  )
}

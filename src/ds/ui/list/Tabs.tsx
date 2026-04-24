import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type Div = Omit<ComponentPropsWithoutRef<'div'>, 'role'>

export function TabList({ orientation, ...rest }: Div & { orientation?: 'horizontal' | 'vertical' }) {
  return <div role="tablist" aria-orientation={orientation} {...rest} />
}

export function Tab({ selected, disabled, controls, children, ...rest }: Div & {
  selected?: boolean; disabled?: boolean; controls?: string; children: ReactNode
}) {
  return (
    <div role="tab" aria-selected={selected} aria-disabled={disabled}
      aria-controls={controls} tabIndex={selected ? 0 : -1} {...rest}>
      {children}
    </div>
  )
}

export function TabPanel({ labelledBy, ...rest }: Div & { labelledBy?: string }) {
  return <div role="tabpanel" aria-labelledby={labelledBy} tabIndex={0} {...rest} />
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useRovingDOM } from '../../core/hooks/useRovingDOM'

// @slot children — composable (wrapper/label/subpart)
type Div = Omit<ComponentPropsWithoutRef<'div'>, 'role'>

export function TabList({ orientation = 'horizontal', ...rest }: Div & { orientation?: 'horizontal' | 'vertical' }) {
  const { onKeyDown, ref } = useRovingDOM<HTMLDivElement>(null, { orientation })
  return <div ref={ref} role="tablist" aria-orientation={orientation} onKeyDown={onKeyDown} {...rest} />
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

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type TabProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  selected?: boolean
  disabled?: boolean
  controls?: string
  children: ReactNode
}

export function Tab({ selected, disabled, controls, children, ...rest }: TabProps) {
  return (
    <div
      role="tab"
      aria-selected={selected}
      aria-disabled={disabled}
      aria-controls={controls}
      tabIndex={selected ? 0 : -1}
      {...rest}
    >
      {children}
    </div>
  )
}

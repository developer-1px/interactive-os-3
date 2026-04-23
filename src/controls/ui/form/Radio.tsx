import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type RadioProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  checked: boolean
  disabled?: boolean
  children: ReactNode
}

export function Radio({ checked, disabled, children, ...rest }: RadioProps) {
  return (
    <div
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={checked ? 0 : -1}
      {...rest}
    >
      {children}
    </div>
  )
}

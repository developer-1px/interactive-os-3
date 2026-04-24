import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — composable (wrapper/label/subpart)
type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  pressed?: boolean
  children: ReactNode
}

export function Button({
  pressed,
  disabled,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

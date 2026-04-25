import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — composable (wrapper/label/subpart)
type ToolbarButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'type'> & {
  pressed?: boolean
  children?: ReactNode
}

export function ToolbarButton({
  pressed,
  disabled,
  children,
  ...rest
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

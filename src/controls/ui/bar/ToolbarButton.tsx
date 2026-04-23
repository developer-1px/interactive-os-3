import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ToolbarButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'type'> & {
  pressed?: boolean
  children: ReactNode
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
      tabIndex={pressed ? 0 : -1}
      {...rest}
    >
      {children}
    </button>
  )
}

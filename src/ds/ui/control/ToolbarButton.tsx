import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type ToolbarButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'type'> & {
  pressed?: boolean
  children?: ReactNode
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(function ToolbarButton(
  { pressed, disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
})

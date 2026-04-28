import type { ComponentPropsWithoutRef } from 'react'

type RadioProps = Omit<ComponentPropsWithoutRef<'button'>, 'role' | 'type'> & {
  checked?: boolean
  disabled?: boolean
}

export function Radio({ checked = false, disabled, ...rest }: RadioProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={checked ? 0 : -1}
      {...rest}
    />
  )
}

import type { ComponentPropsWithoutRef } from 'react'

type SwitchProps = Omit<ComponentPropsWithoutRef<'button'>, 'role' | 'type'> & {
  checked: boolean
  disabled?: boolean
}

export function Switch({ checked, disabled, ...rest }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      {...rest}
    />
  )
}

import type { ComponentPropsWithoutRef } from 'react'

type CheckboxProps = Omit<ComponentPropsWithoutRef<'button'>, 'role' | 'type'> & {
  checked: boolean | 'mixed'
  disabled?: boolean
}

export function Checkbox({ checked, disabled, ...rest }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      {...rest}
    />
  )
}

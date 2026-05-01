import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type SwitchFieldProps = Omit<ComponentPropsWithoutRef<'button'>, 'role' | 'type' | 'onChange' | 'children'> & {
  label: ReactNode
  checked: boolean
  disabled?: boolean
  onChange?: (next: boolean) => void
}

/**
 * Switch + label paired primitive. APG "Switch" pattern — single
 * button[role=switch] containing visual track + label.
 */
export function SwitchField({
  label, checked, disabled, onChange, onClick, ...rest
}: SwitchFieldProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      data-part="switch-field"
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented && !disabled) onChange?.(!checked)
      }}
      {...rest}
    >
      <span data-slot="label">{label}</span>
      <span data-slot="track" aria-hidden="true" />
    </button>
  )
}

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type CheckboxFieldProps = Omit<ComponentPropsWithoutRef<'button'>, 'role' | 'type' | 'onChange' | 'children'> & {
  label: ReactNode
  checked: boolean | 'mixed'
  disabled?: boolean
  onChange?: (next: boolean) => void
}

/**
 * Checkbox + label paired primitive. APG "Tri-State Checkbox" — single
 * button[role=checkbox] containing visual indicator + label, so the entire
 * pill is one tap target with one focus ring (no Row+Checkbox+Text 3-piece).
 */
export function CheckboxField({
  label, checked, disabled, onChange, onClick, ...rest
}: CheckboxFieldProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      data-part="checkbox-field"
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented && !disabled) onChange?.(checked !== true)
      }}
      {...rest}
    >
      <span data-slot="indicator" aria-hidden="true" />
      <span data-slot="label">{label}</span>
    </button>
  )
}

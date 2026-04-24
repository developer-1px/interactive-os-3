import type { ComponentPropsWithoutRef, ReactNode } from 'react'

// @slot children — composable (wrapper/label/subpart)
type Base = Omit<ComponentPropsWithoutRef<'li'>, 'role'> & { disabled?: boolean; children: ReactNode }

export function MenuItem({ disabled, children, selected, ...rest }: Base & { selected?: boolean }) {
  return (
    <li role="menuitem" aria-disabled={disabled || undefined} tabIndex={selected ? 0 : -1} {...rest}>
      {children}
    </li>
  )
}

export function MenuItemCheckbox({ checked, disabled, children, ...rest }: Base & { checked: boolean }) {
  return (
    <li role="menuitemcheckbox" aria-checked={checked} aria-disabled={disabled} tabIndex={checked ? 0 : -1} {...rest}>
      {children}
    </li>
  )
}

export function MenuItemRadio({ checked, disabled, children, ...rest }: Base & { checked: boolean }) {
  return (
    <li role="menuitemradio" aria-checked={checked} aria-disabled={disabled} tabIndex={checked ? 0 : -1} {...rest}>
      {children}
    </li>
  )
}

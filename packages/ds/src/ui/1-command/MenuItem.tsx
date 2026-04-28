import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * MenuItem · MenuItemCheckbox · MenuItemRadio
 *
 * 4-slot anatomy (Option · TreeItem 와 동일 keyline — itemRow.ts SSoT):
 *   leading icon · label (children) · meta (shortcut) · trailing indicator
 */
type Base = Omit<ComponentPropsWithoutRef<'li'>, 'role'> & {
  disabled?: boolean
  /** leading icon token (data-icon) */
  icon?: string
  /** trailing indicator icon token (data-icon) — chevron-right · check 등 */
  indicator?: string
  /** keyboard shortcut 표기 (예: ⌘O) */
  shortcut?: ReactNode
  children: ReactNode
}

function Slots({ icon, shortcut, indicator, children }: Pick<Base, 'icon' | 'shortcut' | 'indicator' | 'children'>) {
  return (
    <>
      {icon && <span data-slot="leading" data-icon={icon} aria-hidden="true" />}
      <span>{children}</span>
      {shortcut && <kbd data-slot="meta">{shortcut}</kbd>}
      {indicator && <span data-slot="trailing" data-icon={indicator} aria-hidden="true" />}
    </>
  )
}

export function MenuItem({ disabled, children, selected, icon, shortcut, indicator, ...rest }: Base & { selected?: boolean }) {
  return (
    <li role="menuitem" aria-disabled={disabled || undefined} tabIndex={selected ? 0 : -1} {...rest}>
      <Slots icon={icon} shortcut={shortcut} indicator={indicator}>{children}</Slots>
    </li>
  )
}

export function MenuItemCheckbox({ checked, disabled, children, icon, shortcut, ...rest }: Base & { checked: boolean }) {
  return (
    <li role="menuitemcheckbox" aria-checked={checked} aria-disabled={disabled || undefined} tabIndex={checked ? 0 : -1} {...rest}>
      <Slots icon={icon} shortcut={shortcut}>{children}</Slots>
    </li>
  )
}

export function MenuItemRadio({ checked, disabled, children, icon, shortcut, ...rest }: Base & { checked: boolean }) {
  return (
    <li role="menuitemradio" aria-checked={checked} aria-disabled={disabled || undefined} tabIndex={checked ? 0 : -1} {...rest}>
      <Slots icon={icon} shortcut={shortcut}>{children}</Slots>
    </li>
  )
}

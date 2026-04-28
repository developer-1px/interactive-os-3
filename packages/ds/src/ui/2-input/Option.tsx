import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'

/**
 * Option — listbox/combobox 자식. role=option.
 *
 * 4-slot anatomy (MenuItem · TreeItem 와 동일 keyline — itemRow.ts SSoT):
 *   leading icon · label (children) · — · trailing indicator (선택 표시)
 */
type OptionProps = Omit<ComponentPropsWithoutRef<'li'>, 'role'> & {
  posinset?: number
  setsize?: number
  selected?: boolean
  disabled?: boolean
  /** leading icon token */
  icon?: string
  /** trailing indicator token (default: selected 시 check) */
  indicator?: string
  children: ReactNode
}

export const Option = forwardRef<HTMLLIElement, OptionProps>(function Option(
  { posinset, setsize, selected, disabled, icon, indicator, children, tabIndex, ...rest },
  ref,
) {
  const trailing = indicator ?? (selected ? 'check' : undefined)
  return (
    <li
      ref={ref}
      role="option"
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      tabIndex={tabIndex ?? (selected ? 0 : -1)}
      {...rest}
    >
      {icon && <span data-slot="leading" data-icon={icon} aria-hidden="true" />}
      <span>{children}</span>
      {trailing && <span data-slot="trailing" data-icon={trailing} aria-hidden="true" />}
    </li>
  )
})

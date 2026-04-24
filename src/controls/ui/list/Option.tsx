import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type OptionProps = Omit<ComponentPropsWithoutRef<'li'>, 'role'> & {
  posinset?: number
  setsize?: number
  selected?: boolean
  disabled?: boolean
  children: ReactNode
}

export const Option = forwardRef<HTMLLIElement, OptionProps>(function Option(
  { posinset, setsize, selected, disabled, children, tabIndex, ...rest },
  ref,
) {
  return (
    <li
      ref={ref}
      role="option"
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-selected={selected}
      aria-disabled={disabled}
      tabIndex={tabIndex ?? (selected ? 0 : -1)}
      {...rest}
    >
      {children}
    </li>
  )
})

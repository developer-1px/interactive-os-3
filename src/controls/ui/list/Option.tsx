import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type OptionProps = Omit<ComponentPropsWithoutRef<'li'>, 'role'> & {
  posinset?: number
  setsize?: number
  selected?: boolean
  disabled?: boolean
  children: ReactNode
}

export function Option({
  posinset,
  setsize,
  selected,
  disabled,
  children,
  ...rest
}: OptionProps) {
  return (
    <li
      role="option"
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-selected={selected}
      aria-disabled={disabled}
      tabIndex={selected ? 0 : -1}
      {...rest}
    >
      {children}
    </li>
  )
}

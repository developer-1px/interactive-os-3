import type { ComponentPropsWithoutRef } from 'react'

type ComboboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'role' | 'type'> & {
  expanded?: boolean
  controls?: string
  activedescendant?: string
  autocomplete?: 'none' | 'inline' | 'list' | 'both'
}

export function Combobox({
  expanded,
  controls,
  activedescendant,
  autocomplete = 'list',
  ...rest
}: ComboboxProps) {
  return (
    <input
      type="text"
      role="combobox"
      aria-expanded={expanded}
      aria-controls={controls}
      aria-activedescendant={activedescendant}
      aria-autocomplete={autocomplete}
      {...rest}
    />
  )
}

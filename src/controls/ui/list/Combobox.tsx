import { forwardRef, type ComponentPropsWithoutRef } from 'react'

type ComboboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'role' | 'type'> & {
  expanded?: boolean
  controls?: string
  activedescendant?: string
  autocomplete?: 'none' | 'inline' | 'list' | 'both'
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  function Combobox(
    { expanded, controls, activedescendant, autocomplete = 'list', ...rest },
    ref,
  ) {
    return (
      <input
        ref={ref}
        type="text"
        role="combobox"
        aria-expanded={expanded}
        aria-controls={controls}
        aria-activedescendant={activedescendant}
        aria-autocomplete={autocomplete}
        {...rest}
      />
    )
  },
)

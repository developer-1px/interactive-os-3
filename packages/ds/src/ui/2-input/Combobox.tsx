import { forwardRef, useEffect, type ComponentPropsWithoutRef } from 'react'

type ComboboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'role' | 'type'> & {
  expanded?: boolean
  controls?: string
  activedescendant?: string
  autocomplete?: 'none' | 'inline' | 'list' | 'both'
  haspopup?: 'listbox' | 'tree' | 'grid' | 'dialog'
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  function Combobox(
    { expanded, controls, activedescendant, autocomplete = 'list', haspopup = 'listbox', ...rest },
    ref,
  ) {
    /* aria-activedescendant 패턴은 실제 DOM focus를 옮기지 않아 브라우저 기본
       focus-driven scroll이 발동하지 않는다. roving(focus-based)이 무료로 받는
       scrollIntoView를 activedescendant 축에서도 동일하게 보장한다. */
    useEffect(() => {
      if (!activedescendant || !controls) return
      const root = document.getElementById(controls)
      const opt = root?.querySelector<HTMLElement>(`[data-id="${CSS.escape(activedescendant)}"]`)
        ?? document.getElementById(activedescendant)
      opt?.scrollIntoView({ block: 'nearest' })
    }, [activedescendant, controls])

    return (
      <input
        ref={ref}
        type="text"
        role="combobox"
        aria-expanded={expanded}
        aria-controls={controls}
        aria-activedescendant={activedescendant}
        aria-autocomplete={autocomplete}
        aria-haspopup={haspopup}
        {...rest}
        aria-disabled={rest.disabled || undefined}
      />
    )
  },
)

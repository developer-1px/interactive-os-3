import type { ItemProps } from './types'

export interface SwitchOptions {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
}

/**
 * switch — WAI-ARIA `switch` role.
 * https://www.w3.org/TR/wai-aria-1.2/#switch
 *
 * Checkbox와 의미 다름 — on/off 즉시 적용. native button + aria-checked.
 */
export function toggleSwitch(opts: SwitchOptions): { switchProps: ItemProps } {
  const { checked, onCheckedChange, disabled, label } = opts
  const switchProps: ItemProps = {
    role: 'switch',
    tabIndex: disabled ? -1 : 0,
    'aria-checked': checked,
    'aria-disabled': disabled || undefined,
    'aria-label': label,
    'data-state': checked ? 'on' : 'off',
    'data-disabled': disabled ? '' : undefined,
    onClick: () => { if (!disabled) onCheckedChange?.(!checked) },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onCheckedChange?.(!checked)
      }
    },
  } as unknown as ItemProps

  return { switchProps }
}

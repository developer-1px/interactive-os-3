import type { ItemProps, RootProps } from './types'

export interface DisclosureOptions {
  open: boolean
  onOpenChange?: (open: boolean) => void
  idPrefix?: string
}

/**
 * disclosure — APG `/disclosure/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * 단순 controlled toggle. uncontrolled 는 useControlState 로 wrap.
 */
export function disclosurePattern(opts: DisclosureOptions): {
  triggerProps: ItemProps
  panelProps: RootProps
} {
  const { open, onOpenChange, idPrefix = 'disc' } = opts
  const panelId = `${idPrefix}-panel`

  const triggerProps: ItemProps = {
    'aria-expanded': open,
    'aria-controls': panelId,
    onClick: () => onOpenChange?.(!open),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onOpenChange?.(!open)
      }
    },
    'data-state': open ? 'open' : 'closed',
  } as unknown as ItemProps

  const panelProps: RootProps = {
    role: 'region',
    id: panelId,
    hidden: !open,
    'data-state': open ? 'open' : 'closed',
  } as unknown as RootProps

  return { triggerProps, panelProps }
}

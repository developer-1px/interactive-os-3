import { useId, type CSSProperties } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type CollectionProps, type Event } from '../../core/types'
import { activate, composeAxes, expand, navigate, typeahead } from '../../core/axes'
import { useRoving } from '../../core/hooks/useRoving'
import { MenuPopover, type MenuCtx } from '../6-overlay/MenuPopover'

const axis = composeAxes(navigate('vertical'), expand, activate, typeahead)

export function Menu({ data, onEvent }: CollectionProps) {
  const popoverId = useId()
  const { focusId, expanded, onKey, bindFocus } = useRoving(axis, data, onEvent)
  const anchorName = (id: string) => `--menu-anchor-${popoverId.replace(/[^a-zA-Z0-9]/g, '')}-${id}`
  const firstEnabled = (p: string) => getChildren(data, p).find((k) => !isDisabled(data, k))

  const clickEvents = (id: string): Event[] => {
    if (isDisabled(data, id)) return []
    const kids = getChildren(data, id)
    if (!kids.length) return [{ type: 'activate', id }]
    const open = expanded.has(id)
    const events: Event[] = [{ type: 'expand', id, open: !open }]
    const first = !open ? firstEnabled(id) : undefined
    if (first) events.push({ type: 'navigate', id: first })
    return events
  }

  const toggleEvents = (id: string, open: boolean): Event[] => {
    if (id === ROOT) {
      const events: Event[] = [{ type: 'open', id: ROOT, open }]
      const first = open ? firstEnabled(ROOT) : undefined
      if (first) events.push({ type: 'navigate', id: first })
      return events
    }
    return !open && expanded.has(id) ? [{ type: 'expand', id, open: false }] : []
  }

  const ctx: MenuCtx = {
    data, focusId, expanded, anchorName, bindFocus,
    onToggle: (id, open) => toggleEvents(id, open).forEach(onEvent),
    onKey,
    onClick: (id) => clickEvents(id).forEach(onEvent),
  }

  return (
    <>
      <button type="button" popoverTarget={popoverId} aria-haspopup="menu"
        style={{ anchorName: anchorName(ROOT) } as CSSProperties}>{getLabel(data, ROOT)}</button>
      <MenuPopover ctx={ctx} parentId={ROOT} domId={popoverId} style={{
        positionAnchor: anchorName(ROOT), top: 'anchor(bottom)',
        left: 'anchor(left)', marginBlockStart: 'var(--ds-space)',
      } as CSSProperties} />
    </>
  )
}

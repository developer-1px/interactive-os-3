import { useId, type CSSProperties } from 'react'
import { ROOT, getChildren, getFocus, getExpanded, getLabel, isDisabled, type ControlProps, type Event } from '../../core/types'
import { activate, composeAxes, expand, navigate, typeahead } from '../../axes'
import { bindAxis } from '../../core/bind'
import { useFocusBridge } from '../../core/focus'
import { MenuPopover, type MenuCtx } from './MenuPopover'

const axis = composeAxes(navigate('vertical'), expand, activate, typeahead)

export function Menu({ data, onEvent }: ControlProps) {
  const popoverId = useId()
  const focusId = getFocus(data)
  const expanded = getExpanded(data)
  const onKey = bindAxis(axis, data, onEvent)
  const bindFocus = useFocusBridge(focusId)
  const anchorName = (id: string) => `--menu-anchor-${popoverId.replace(/[^a-zA-Z0-9]/g, '')}-${id}`
  const firstEnabled = (p: string) => getChildren(data, p).find((k) => !isDisabled(data, k))

  const clickEvents = (id: string): Event[] => {
    if (isDisabled(data, id)) return []
    const kids = getChildren(data, id)
    const open = expanded.has(id)
    if (!kids.length) return [{ type: 'activate', id }]
    const first = !open ? firstEnabled(id) : undefined
    return [
      { type: 'expand', id, open: !open },
      ...(first ? [{ type: 'navigate', id: first } as Event] : []),
    ]
  }

  const toggleEvents = (id: string, open: boolean): Event[] => {
    if (id === ROOT) {
      const first = open ? firstEnabled(ROOT) : undefined
      return [
        { type: 'open', id: ROOT, open },
        ...(first ? [{ type: 'navigate', id: first } as Event] : []),
      ]
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

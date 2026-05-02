import { useId, type CSSProperties, type KeyboardEvent } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type CollectionProps, type UiEvent } from '@p/headless/types'
import { activate, composeAxes, expand, navigate, typeahead } from '@p/headless/axes'
import { useRovingTabIndex } from '@p/headless/roving/useRovingTabIndex'
import { MenuPopover, type MenuCtx } from '../4-window/MenuPopover'
import { readMenuRole, type MenuApgOptions } from './menuModel'

const axis = composeAxes(navigate('vertical'), expand, activate, typeahead)
type MenuProps = CollectionProps<{ apg?: MenuApgOptions }>

export function Menu({ data, onEvent, apg }: MenuProps) {
  const popoverId = useId()
  const emit = onEvent ?? (() => {})
  const { focusId, expanded, onKey, bindFocus } = useRovingTabIndex(axis, data, emit)
  const anchorName = (id: string) => `--menu-anchor-${popoverId.replace(/[^a-zA-Z0-9]/g, '')}-${id}`
  const firstEnabled = (p: string) => getChildren(data, p).find((k) => !isDisabled(data, k))

  const clickEvents = (id: string): UiEvent[] => {
    if (isDisabled(data, id)) return []
    const kids = getChildren(data, id)
    if (!kids.length) return [{ type: 'activate', id }]
    const open = expanded.has(id)
    const events: UiEvent[] = [{ type: 'expand', id, open: !open }]
    const first = !open ? firstEnabled(id) : undefined
    if (first) events.push({ type: 'navigate', id: first })
    return events
  }

  const keyEvents = (event: KeyboardEvent, id: string): boolean => {
    const role = readMenuRole(data, id)
    if (
      event.key === ' '
      && apg?.selectionActivation !== 'activate'
      && (role === 'menuitemcheckbox' || role === 'menuitemradio')
    ) {
      emit({ type: 'select', id })
      event.preventDefault()
      return true
    }
    if (
      (event.key === 'Enter' || event.key === ' ')
      && apg?.parentActivation === 'activate'
      && getChildren(data, id).length > 0
    ) {
      emit({ type: 'activate', id })
      event.preventDefault()
      return true
    }
    return onKey(event, id)
  }

  const toggleEvents = (id: string, open: boolean): UiEvent[] => {
    if (id === ROOT) {
      const events: UiEvent[] = [{ type: 'open', id: ROOT, open }]
      const first = open ? firstEnabled(ROOT) : undefined
      if (first) events.push({ type: 'navigate', id: first })
      return events
    }
    return !open && expanded.has(id) ? [{ type: 'expand', id, open: false }] : []
  }

  const ctx: MenuCtx = {
    data, focusId, expanded, anchorName, bindFocus,
    onToggle: (id, open) => toggleEvents(id, open).forEach(emit),
    onKey: keyEvents,
    onClick: (id) => clickEvents(id).forEach(emit),
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

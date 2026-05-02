import { useId, type CSSProperties, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type CollectionProps, type UiEvent } from '@p/headless/types'
import { activate, composeAxes, expand, navigate, typeahead } from '@p/headless/axes'
import { useRovingTabIndex } from '@p/headless/roving/useRovingTabIndex'
import { useSpatialNavigation } from '@p/headless/roving/useSpatialNavigation'
import { MenuPopover, type MenuCtx } from '../4-window/MenuPopover'
import { isMenuChecked, readMenuRole, type MenuApgOptions } from './menuModel'

// @slot children — composable (wrapper/label/subpart)
type StaticMenubarProps = Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
  children: ReactNode
}

type DataMenubarProps = CollectionProps<{
  orientation?: 'horizontal' | 'vertical'
  apg?: MenuApgOptions
  'aria-label'?: string
}>

type MenubarProps = StaticMenubarProps | DataMenubarProps

const isDataMenubar = (props: MenubarProps): props is DataMenubarProps =>
  'data' in props

const firstEnabled = (data: DataMenubarProps['data'], parentId: string) =>
  getChildren(data, parentId).find((id) => !isDisabled(data, id))

export function Menubar(props: MenubarProps) {
  if (isDataMenubar(props)) return <DataMenubar {...props} />
  return <StaticMenubar {...props} />
}

function StaticMenubar(props: StaticMenubarProps) {
  const { orientation = 'horizontal', children, ...rest } = props
  // MenuItem 은 selected 일 때만 tabIndex=0 — 기본 TABBABLE selector 로는 발견 ❌
  // → itemSelector 명시 (TreeGrid/Listbox 와 같은 그룹).
  const { onKeyDown, ref } = useSpatialNavigation<HTMLUListElement>(null, {
    orientation,
    itemSelector: '[role="menuitem"]:not([aria-disabled="true"])',
  })
  return (
    <ul ref={ref} role="menubar" aria-orientation={orientation} onKeyDown={onKeyDown} {...rest}>
      {children}
    </ul>
  )
}

function DataMenubar({ data, onEvent, orientation = 'horizontal', apg, ...rest }: DataMenubarProps) {
  const id = useId()
  const emit = onEvent ?? (() => {})
  const topAxis = composeAxes(navigate(orientation), expand, activate, typeahead)
  const menuAxis = composeAxes(navigate('vertical'), expand, activate, typeahead)
  const { focusId, expanded, onKey, bindFocus } = useRovingTabIndex(topAxis, data, emit)
  const submenu = useRovingTabIndex(menuAxis, data, emit)
  const kids = getChildren(data, ROOT)
  const branches = kids.filter((kid) => readMenuRole(data, kid) !== 'separator' && getChildren(data, kid).length > 0)
  const anchorName = (itemId: string) => `--menubar-anchor-${id.replace(/[^a-zA-Z0-9]/g, '')}-${itemId}`

  const clickEvents = (itemId: string): UiEvent[] => {
    if (isDisabled(data, itemId)) return []
    const role = readMenuRole(data, itemId)
    if (role === 'separator') return []
    const itemKids = getChildren(data, itemId)
    if (!itemKids.length) return [{ type: 'activate', id: itemId }]
    const open = expanded.has(itemId)
    const events: UiEvent[] = [{ type: 'expand', id: itemId, open: !open }]
    const first = !open ? firstEnabled(data, itemId) : undefined
    if (first) events.push({ type: 'navigate', id: first })
    return events
  }

  const toggleEvents = (itemId: string, open: boolean): UiEvent[] =>
    !open && expanded.has(itemId) ? [{ type: 'expand', id: itemId, open: false }] : []

  const ctx: MenuCtx = {
    data,
    focusId,
    expanded,
    anchorName,
    bindFocus: submenu.bindFocus,
    onToggle: (itemId, open) => toggleEvents(itemId, open).forEach(emit),
    onKey: (event, itemId) => {
      const role = readMenuRole(data, itemId)
      if (
        event.key === ' '
        && apg?.selectionActivation !== 'activate'
        && (role === 'menuitemcheckbox' || role === 'menuitemradio')
      ) {
        emit({ type: 'select', id: itemId })
        event.preventDefault()
        return true
      }
      if (
        (event.key === 'Enter' || event.key === ' ')
        && apg?.parentActivation === 'activate'
        && getChildren(data, itemId).length > 0
      ) {
        emit({ type: 'activate', id: itemId })
        event.preventDefault()
        return true
      }
      return submenu.onKey(event, itemId)
    },
    onClick: (itemId) => clickEvents(itemId).forEach(emit),
  }

  const onTopKey = (event: KeyboardEvent, itemId: string, branch: boolean) => {
    const openKey = orientation === 'horizontal' ? 'ArrowDown' : 'ArrowRight'
    if (branch && event.key === openKey) {
      clickEvents(itemId).forEach(emit)
      event.preventDefault()
      return
    }
    onKey(event, itemId)
  }

  return (
    <>
      <ul role="menubar" aria-orientation={orientation} {...rest}>
        {kids.map((itemId, i) => {
          const role = readMenuRole(data, itemId)
          if (role === 'separator') {
            return <li key={itemId} role="separator" aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'} />
          }
          const branch = getChildren(data, itemId).length > 0
          const disabled = isDisabled(data, itemId)
          const focused = focusId === itemId
          return (
            <li
              key={itemId}
              role={role}
              data-id={itemId}
              tabIndex={focused ? 0 : -1}
              ref={bindFocus(itemId)}
              aria-checked={role === 'menuitemcheckbox' || role === 'menuitemradio' ? isMenuChecked(data, itemId) : undefined}
              aria-disabled={disabled || undefined}
              aria-haspopup={branch ? 'menu' : undefined}
              aria-expanded={branch ? expanded.has(itemId) : undefined}
              aria-posinset={i + 1}
              aria-setsize={kids.length}
              onClick={() => clickEvents(itemId).forEach(emit)}
              onKeyDown={(event) => { onTopKey(event, itemId, branch) }}
              style={branch ? ({ anchorName: anchorName(itemId) } as CSSProperties) : undefined}
            >
              {getLabel(data, itemId)}
            </li>
          )
        })}
      </ul>
      {branches.map((itemId) => (
        <MenuPopover key={itemId} ctx={ctx} parentId={itemId} style={{
          positionAnchor: anchorName(itemId),
          top: 'anchor(bottom)',
          left: 'anchor(left)',
          marginBlockStart: 'var(--ds-space)',
        } as CSSProperties} />
      ))}
    </>
  )
}

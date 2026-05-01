import { useCallback } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, navigate } from '../axes'
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface TabsOptions {
  orientation?: 'horizontal' | 'vertical'
  /** APG: auto = ArrowKey 가 즉시 panel 전환. manual = Enter/Space 로 활성화. */
  activationMode?: 'automatic' | 'manual'
  autoFocus?: boolean
  /** stable id prefix (SSR-safe). */
  idPrefix?: string
}

/**
 * tabs — APG `/tabs/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * tabProps(id)·panelProps(id) 가 `aria-controls`/`aria-labelledby` 자동 연결.
 */
export function tabs(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: TabsOptions = {},
): {
  rootProps: RootProps
  tabProps: (id: string) => ItemProps
  panelProps: (id: string) => ItemProps
  items: BaseItem[]
} {
  const {
    orientation = 'horizontal',
    activationMode = 'automatic',
    autoFocus,
    idPrefix = 'tabs',
  } = opts

  const axis = composeAxes(navigate(orientation), activate)
  const relay = useCallback(
    (e: UiEvent) => {
      if (!onEvent) return
      const out = activationMode === 'automatic' ? applySelectionFollowsFocus(data, e) : [e]
      out.forEach(onEvent)
    },
    [data, onEvent, activationMode],
  )

  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, data, relay, { autoFocus })
  const ids = getChildren(data, ROOT)

  const items: BaseItem[] = ids.map((id, i) => {
    const ent = data.entities[id]?.data ?? {}
    return {
      id,
      label: getLabel(data, id),
      selected: Boolean(ent.selected),
      disabled: isDisabled(data, id),
      posinset: i + 1,
      setsize: ids.length,
    }
  })

  const tabId = (id: string) => `${idPrefix}-tab-${id}`
  const panelId = (id: string) => `${idPrefix}-panel-${id}`

  const rootProps: RootProps = {
    role: 'tablist',
    'aria-orientation': orientation,
    ...delegate,
  } as RootProps

  const tabProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    const isFocus = focusId === id
    return {
      role: 'tab',
      id: tabId(id),
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-selected': it?.selected ?? false,
      'aria-disabled': it?.disabled || undefined,
      'aria-controls': panelId(id),
      'data-selected': it?.selected ? '' : undefined,
      'data-disabled': it?.disabled ? '' : undefined,
    } as unknown as ItemProps
  }

  const panelProps = (id: string): ItemProps => ({
    role: 'tabpanel',
    id: panelId(id),
    'aria-labelledby': tabId(id),
    tabIndex: 0,
    hidden: !items.find((x) => x.id === id)?.selected,
  } as unknown as ItemProps)

  return { rootProps, tabProps, panelProps, items }
}

import { useCallback } from 'react'
import {
  ROOT, getChildren, getLabel, isDisabled, getExpanded,
  type NormalizedData, type UiEvent,
} from '../types'
import { activate, composeAxes, multiSelect, treeExpand, treeNavigate, typeahead } from '../axes'
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps, TreeItem } from './types'

export interface TreeOptions {
  /** aria-orientation. Spec implicit value: 'vertical'. */
  orientation?: 'horizontal' | 'vertical'
  /** Default: `!multiSelectable` (APG: single sff, multi explicit toggle). */
  selectionFollowsFocus?: boolean
  /** aria-multiselectable. */
  multiSelectable?: boolean
  autoFocus?: boolean
  /** Container entity for nested trees; defaults to ROOT. */
  containerId?: string
  /** aria-label — ARIA: tree requires accessible name. */
  label?: string
  labelledBy?: string
}

const singleAxis = composeAxes(treeNavigate, treeExpand, activate, typeahead)
const multiAxis = composeAxes(multiSelect, treeNavigate, treeExpand, activate, typeahead)

/**
 * tree — APG `/treeview/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */
export function useTreePattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: TreeOptions = {},
): {
  rootProps: RootProps
  itemProps: (id: string) => ItemProps
  items: TreeItem[]
} {
  const {
    autoFocus, multiSelectable, containerId = ROOT, orientation = 'vertical',
    label, labelledBy,
  } = opts
  const sff = opts.selectionFollowsFocus ?? !multiSelectable

  const relay = useCallback(
    (e: UiEvent) => {
      if (!onEvent) return
      const out = sff ? applySelectionFollowsFocus(data, e) : [e]
      out.forEach(onEvent)
    },
    [data, onEvent, sff],
  )

  const axis = multiSelectable ? multiAxis : singleAxis
  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, data, relay, {
    autoFocus,
    containerId,
  })
  const expanded = getExpanded(data)

  const flat: TreeItem[] = []
  const walk = (parent: string, level: number) => {
    const children = getChildren(data, parent)
    children.forEach((id, i) => {
      const ent = data.entities[id] ?? {}
      const kids = getChildren(data, id)
      const isExpanded = expanded.has(id)
      flat.push({
        id,
        label: getLabel(data, id),
        selected: Boolean(ent.selected),
        disabled: isDisabled(data, id),
        level,
        expanded: isExpanded,
        hasChildren: kids.length > 0,
        posinset: i + 1,
        setsize: children.length,
      })
      if (isExpanded) walk(id, level + 1)
    })
  }
  walk(containerId, 1)
  const itemMap = new Map(flat.map((it) => [it.id, it]))

  const rootProps: RootProps = {
    role: 'tree',
    'aria-multiselectable': multiSelectable || undefined,
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as RootProps

  const itemProps = (id: string): ItemProps => {
    const it = itemMap.get(id)
    const isFocus = focusId === id
    return {
      role: 'treeitem',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-selected': it?.selected ?? false,
      'aria-disabled': it?.disabled || undefined,
      'aria-expanded': it?.hasChildren ? it.expanded : undefined,
      'aria-level': it?.level,
      'aria-posinset': it?.posinset,
      'aria-setsize': it?.setsize,
      'data-selected': it?.selected ? '' : undefined,
      'data-expanded': it?.expanded ? '' : undefined,
    } as unknown as ItemProps
  }

  return { rootProps, itemProps, items: flat }
}

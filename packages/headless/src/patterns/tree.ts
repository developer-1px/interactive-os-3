import {
  ROOT, getChildren, getLabel, isDisabled, getExpanded,
  type NormalizedData, type UiEvent,
} from '../types'
import { activate, composeAxes, treeExpand, treeNavigate, typeahead } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps, TreeItem } from './types'

export interface TreeOptions {
  selectionMode?: 'none' | 'single' | 'multiple'
  autoFocus?: boolean
}

const axis = composeAxes(treeNavigate, treeExpand, activate, typeahead)

/**
 * tree — APG `/treeview/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 *
 * 키보드: Arrow↑↓ visible 노드 이동, Arrow→ expand/내려가기, Arrow← collapse/부모,
 * Home/End, typeahead, Enter/Space activate.
 *
 * items 는 visible 노드만 평탄화하여 level 포함 반환.
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
  const { autoFocus } = opts
  const { focusId, bindFocus, delegate } = useRovingTabIndex(
    axis, data, onEvent ?? (() => {}), { autoFocus },
  )
  const expanded = getExpanded(data)

  const flat: TreeItem[] = []
  const walk = (parent: string, level: number) => {
    const children = getChildren(data, parent)
    children.forEach((id, i) => {
      const ent = data.entities[id]?.data ?? {}
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
  walk(ROOT, 1)

  const rootProps: RootProps = { role: 'tree', ...delegate } as RootProps

  const itemProps = (id: string): ItemProps => {
    const it = flat.find((x) => x.id === id)
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

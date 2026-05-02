import { ROOT, getChildren, getLabel, isDisabled, getExpanded, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, multiSelect, treeExpand, treeNavigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps, TreeItem } from './types'

export interface TreeGridOptions {
  multiSelectable?: boolean
  selectionMode?: 'none' | 'single' | 'multiple'
  autoFocus?: boolean
}

const singleAxis = composeAxes(treeNavigate, treeExpand, activate)
const multiAxis = composeAxes(multiSelect, treeNavigate, treeExpand, activate)

/**
 * treeGrid — APG `/treegrid/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/
 *
 * tree visible order navigation + branch expand. Focus stays on rows; cells
 * expose grid semantics through rowheader/gridcell + aria-colindex.
 */
export function useTreeGridPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: TreeGridOptions = {},
): {
  rootProps: RootProps
  rowProps: (id: string) => ItemProps
  cellProps: (rowId: string, colIndex: number) => ItemProps
  items: TreeItem[]
} {
  const { autoFocus, multiSelectable, selectionMode } = opts
  const isMultiSelectable = multiSelectable || selectionMode === 'multiple'
  const axis = isMultiSelectable ? multiAxis : singleAxis
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
        id, label: getLabel(data, id),
        selected: Boolean(ent.selected), disabled: isDisabled(data, id),
        level, expanded: isExpanded, hasChildren: kids.length > 0,
        posinset: i + 1, setsize: children.length,
      })
      if (isExpanded) walk(id, level + 1)
    })
  }
  walk(ROOT, 1)
  const rowMap = new Map(flat.map((it) => [it.id, it]))

  const rootProps: RootProps = {
    role: 'treegrid',
    'aria-multiselectable': isMultiSelectable || undefined,
    ...delegate,
  } as RootProps

  const rowProps = (id: string): ItemProps => {
    const it = rowMap.get(id)
    const isFocus = focusId === id
    return {
      role: 'row',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-selected': it?.selected ?? false,
      'aria-expanded': it?.hasChildren ? it.expanded : undefined,
      'aria-level': it?.level,
      'aria-posinset': it?.posinset,
      'aria-setsize': it?.setsize,
    } as unknown as ItemProps
  }

  const cellProps = (rowId: string, colIndex: number): ItemProps => ({
    role: colIndex === 0 ? 'rowheader' : 'gridcell',
    'data-row': rowId,
    'data-col': colIndex,
    'aria-colindex': colIndex + 1,
  } as unknown as ItemProps)

  return { rootProps, rowProps, cellProps, items: flat }
}

import { ROOT, getChildren, getLabel, isDisabled, getExpanded, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, treeExpand, navigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps, TreeItem } from './types'

export interface TreeGridOptions {
  selectionMode?: 'none' | 'single' | 'multiple'
  autoFocus?: boolean
}

const axis = composeAxes(navigate('vertical'), navigate('horizontal'), treeExpand, activate)

/**
 * treeGrid — APG `/treegrid/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/
 *
 * row + cell 2축 + branch expand. row 기준 roving (cell focus 는 row 안에서 각자).
 */
export function treeGrid(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: TreeGridOptions = {},
): {
  rootProps: RootProps
  rowProps: (id: string) => ItemProps
  cellProps: (rowId: string, colIndex: number) => ItemProps
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
        id, label: getLabel(data, id),
        selected: Boolean(ent.selected), disabled: isDisabled(data, id),
        level, expanded: isExpanded, hasChildren: kids.length > 0,
        posinset: i + 1, setsize: children.length,
      })
      if (isExpanded) walk(id, level + 1)
    })
  }
  walk(ROOT, 1)

  const rootProps: RootProps = { role: 'treegrid', ...delegate } as RootProps

  const rowProps = (id: string): ItemProps => {
    const it = flat.find((x) => x.id === id)
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
  } as unknown as ItemProps)

  return { rootProps, rowProps, cellProps, items: flat }
}

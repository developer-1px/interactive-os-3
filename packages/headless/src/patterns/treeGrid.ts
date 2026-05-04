import { useCallback } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, getExpanded, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, multiSelect, treeExpand, treeNavigate } from '../axes'
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps, TreeItem } from './types'

export interface TreeGridOptions {
  /** aria-orientation. Spec implicit value: 'horizontal' for grid family. */
  orientation?: 'horizontal' | 'vertical'
  /** Default: `!multiSelectable` (APG: single sff, multi explicit toggle). */
  selectionFollowsFocus?: boolean
  /** aria-multiselectable. */
  multiSelectable?: boolean
  autoFocus?: boolean
  /** Container entity for nested grids; defaults to ROOT. */
  containerId?: string
  /** aria-label — ARIA: treegrid requires accessible name. */
  label?: string
  labelledBy?: string
  /** aria-colcount — total columns (header column count). */
  colCount?: number
}

/** TreeGrid 가 등록하는 axis — SSOT. */
export const treeGridAxis = (opts: { multiSelectable?: boolean } = {}) =>
  opts.multiSelectable
    ? composeAxes(multiSelect, treeNavigate, treeExpand, activate)
    : composeAxes(treeNavigate, treeExpand, activate)
const singleAxis = treeGridAxis()
const multiAxis = treeGridAxis({ multiSelectable: true })

/**
 * treeGrid — APG `/treegrid/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/
 *
 * Focus stays on rows; cells expose grid semantics through rowheader/gridcell + aria-colindex.
 */
export function useTreeGridPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: TreeGridOptions = {},
): {
  treegridProps: RootProps
  headerRowProps: ItemProps
  rowProps: (id: string) => ItemProps
  columnheaderProps: (colIndex: number) => ItemProps
  rowheaderProps: (rowId: string) => ItemProps
  gridcellProps: (rowId: string, colIndex: number) => ItemProps
  items: TreeItem[]
} {
  const {
    autoFocus, multiSelectable, containerId = ROOT, orientation = 'horizontal',
    label, labelledBy, colCount,
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
        id, label: getLabel(data, id),
        selected: Boolean(ent.selected), disabled: isDisabled(data, id),
        level, expanded: isExpanded, hasChildren: kids.length > 0,
        posinset: i + 1, setsize: children.length,
      })
      if (isExpanded) walk(id, level + 1)
    })
  }
  walk(containerId, 1)
  const HEADER_ROWS = 1
  const rowMap = new Map(flat.map((it, idx) => [it.id, { it, idx }]))

  const treegridProps: RootProps = {
    role: 'treegrid',
    'aria-multiselectable': multiSelectable || undefined,
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    'aria-rowcount': flat.length + HEADER_ROWS,
    'aria-colcount': colCount,
    ...delegate,
  } as RootProps

  const headerRowProps: ItemProps = {
    role: 'row',
    'aria-rowindex': 1,
  } as unknown as ItemProps

  const rowProps = (id: string): ItemProps => {
    const entry = rowMap.get(id)
    const it = entry?.it
    const isFocus = focusId === id
    return {
      role: 'row',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-rowindex': entry ? entry.idx + 1 + HEADER_ROWS : undefined,
      'aria-selected': it?.selected ?? false,
      'aria-expanded': it?.hasChildren ? it.expanded : undefined,
      'aria-level': it?.level,
      'aria-posinset': it?.posinset,
      'aria-setsize': it?.setsize,
    } as unknown as ItemProps
  }

  const columnheaderProps = (colIndex: number): ItemProps => ({
    role: 'columnheader',
    'data-col': colIndex,
    'aria-colindex': colIndex + 1,
  } as unknown as ItemProps)

  const rowheaderProps = (rowId: string): ItemProps => ({
    role: 'rowheader',
    'data-row': rowId,
    'data-col': 0,
    'aria-colindex': 1,
  } as unknown as ItemProps)

  const gridcellProps = (rowId: string, colIndex: number): ItemProps => ({
    role: 'gridcell',
    'data-row': rowId,
    'data-col': colIndex,
    'aria-colindex': colIndex + 1,
  } as unknown as ItemProps)

  return {
    treegridProps,
    headerRowProps,
    rowProps,
    columnheaderProps,
    rowheaderProps,
    gridcellProps,
    items: flat,
  }
}

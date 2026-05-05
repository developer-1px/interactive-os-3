import { useCallback, useEffect, useRef, useState } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, getExpanded, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, multiSelect, treeExpand, treeNavigate } from '../axes'
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps, TreeItem } from './types'

/** Options for {@link useTreeGridPattern}. */
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
  /**
   * APG email-inbox 3 모드. default `'rowsFirst'`.
   * - `'rowsFirst'`: focus 단위 = row. 화살표 = treeNavigate (위/아래 row, 좌/우 expand/collapse).
   * - `'cellsFirst'`: focus 단위 = cell. 2D 화살표, row 의 `aria-selected` 가 focused cell 의 row 를 반영.
   * - `'cellsOnly'`: cellsFirst 와 동일 키보드, 단 row 자체엔 `aria-selected` 표시 안 함.
   */
  navMode?: 'rowsFirst' | 'cellsFirst' | 'cellsOnly'
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
    label, labelledBy, colCount, navMode = 'rowsFirst',
  } = opts
  const sff = opts.selectionFollowsFocus ?? !multiSelectable
  const cellsMode = navMode !== 'rowsFirst'
  const colsCount = colCount ?? 1

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

  // ─── cells-mode (cellsFirst / cellsOnly) ────────────────────────────────
  const [cellFocus, setCellFocus] = useState<{ rowId: string; col: number } | null>(null)
  useEffect(() => {
    if (!cellsMode) return
    if (cellFocus && rowMap.has(cellFocus.rowId)) return
    const first = flat[0]?.id
    if (first) setCellFocus({ rowId: first, col: 0 })
  }, [cellsMode, flat, cellFocus, rowMap])

  const cellRefs = useRef(new Map<string, HTMLElement | null>())
  const cellKey = (rowId: string, col: number) => `${rowId}::${col}`

  useEffect(() => {
    if (!cellsMode || !cellFocus) return
    const el = cellRefs.current.get(cellKey(cellFocus.rowId, cellFocus.col))
    el?.focus({ preventScroll: true })
  }, [cellsMode, cellFocus])

  const moveCell = (dRow: number, dCol: number) => {
    if (!cellFocus) return
    const idx = flat.findIndex((it) => it.id === cellFocus.rowId)
    if (idx < 0) return
    const nextRowIdx = Math.max(0, Math.min(flat.length - 1, idx + dRow))
    const nextCol = Math.max(0, Math.min(colsCount - 1, cellFocus.col + dCol))
    setCellFocus({ rowId: flat[nextRowIdx].id, col: nextCol })
  }

  const cellModeKeyDown = (rowId: string, _col: number) => (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); moveCell(0, -1); break
      case 'ArrowRight': e.preventDefault(); moveCell(0, 1); break
      case 'ArrowUp': e.preventDefault(); moveCell(-1, 0); break
      case 'ArrowDown': e.preventDefault(); moveCell(1, 0); break
      case 'Home': e.preventDefault(); setCellFocus({ rowId, col: 0 }); break
      case 'End': e.preventDefault(); setCellFocus({ rowId, col: colsCount - 1 }); break
      case 'Enter':
      case ' ':
        e.preventDefault()
        relay({ type: 'activate', id: rowId })
        break
    }
  }
  // ────────────────────────────────────────────────────────────────────────

  // cells-mode 에선 row 단위 onKeyDown delegate 를 끈다 (cell 이 직접 수신).
  const treegridProps: RootProps = {
    role: 'treegrid',
    'aria-multiselectable': multiSelectable || undefined,
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    'aria-rowcount': flat.length + HEADER_ROWS,
    'aria-colcount': colCount,
    ...(cellsMode ? {} : delegate),
  } as RootProps

  const headerRowProps: ItemProps = {
    role: 'row',
    'aria-rowindex': 1,
  } as unknown as ItemProps

  const rowProps = (id: string): ItemProps => {
    const entry = rowMap.get(id)
    const it = entry?.it
    if (cellsMode) {
      const isFocusRow = navMode === 'cellsFirst' && cellFocus?.rowId === id
      return {
        role: 'row',
        'data-id': id,
        'aria-rowindex': entry ? entry.idx + 1 + HEADER_ROWS : undefined,
        'aria-selected': isFocusRow ? true : (it?.selected ?? undefined),
        'aria-expanded': it?.hasChildren ? it.expanded : undefined,
        'aria-level': it?.level,
        'aria-posinset': it?.posinset,
        'aria-setsize': it?.setsize,
      } as unknown as ItemProps
    }
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

  const gridcellProps = (rowId: string, colIndex: number): ItemProps => {
    const base = {
      role: 'gridcell',
      'data-row': rowId,
      'data-col': colIndex,
      'aria-colindex': colIndex + 1,
    }
    if (!cellsMode) return base as unknown as ItemProps
    const isFocus = cellFocus?.rowId === rowId && cellFocus.col === colIndex
    return {
      ...base,
      ref: ((el: HTMLElement | null) => {
        cellRefs.current.set(cellKey(rowId, colIndex), el)
      }) as unknown as React.Ref<HTMLElement>,
      tabIndex: isFocus ? 0 : -1,
      'data-focus-visible': isFocus ? '' : undefined,
      onKeyDown: cellModeKeyDown(rowId, colIndex),
    } as unknown as ItemProps
  }

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

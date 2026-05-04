import { useCallback } from 'react'
import {
  ROOT,
  getChildren,
  getLabel,
  isDisabled,
  type NormalizedData,
  type UiEvent,
} from '../types'
import { activate, composeAxes, gridNavigate, gridMultiSelect } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps } from './types'

/** Options for {@link useGridPattern}. */
export interface GridOptions {
  /** Container entity for nested grids; defaults to ROOT. */
  containerId?: string
  /** aria-readonly. */
  readOnly?: boolean
  /** aria-rowcount — total rows when some are hidden/virtualized. */
  rowCount?: number
  /** aria-colcount — total cols when some are hidden/virtualized. */
  colCount?: number
  /** aria-multiselectable — Ctrl+Space (col), Shift+Space (row), Ctrl+A (all) 활성화. */
  multiSelectable?: boolean
  autoFocus?: boolean
  /** aria-label — ARIA: grid requires accessible name. */
  label?: string
  labelledBy?: string
}

/** Cell view fed to consumer for rendering. */
export interface GridCell {
  id: string
  rowId: string
  rowIndex: number
  colIndex: number
  label: string
  selected: boolean
  disabled: boolean
}

/** Grid 가 등록하는 axis — SSOT. */
export const gridAxis = (opts: { multiSelectable?: boolean } = {}) =>
  opts.multiSelectable
    ? composeAxes(gridMultiSelect, gridNavigate, activate)
    : composeAxes(gridNavigate, activate)
const baseAxis = gridAxis()
const multiAxis = gridAxis({ multiSelectable: true })

/**
 * grid — APG `/grid/` recipe (data grid keyboard model, cell-focus).
 * https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * data 모델: container → rows → cells. focus 단위 = cell.
 * treegrid 와의 차이: treegrid 는 row 단위 focus + tree 확장, grid 는 cell 단위 2D nav.
 *
 * Cell editing(F2/Enter/Escape) 은 declarative recipe 범위 밖 — 소비자가 cell content
 * 안에서 처리. activate(Enter/Space)는 onEvent 로 emit 만 한다.
 */
export function useGridPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: GridOptions = {},
): {
  rootProps: RootProps
  rowProps: (id: string) => ItemProps
  columnHeaderProps: (id: string) => ItemProps
  rowHeaderProps: (id: string) => ItemProps
  cellProps: (id: string) => ItemProps
  rows: { id: string; cells: GridCell[] }[]
} {
  const {
    autoFocus, containerId = ROOT, readOnly, rowCount, colCount, multiSelectable,
    label, labelledBy,
  } = opts
  const rowIds = getChildren(data, containerId)
  // grid 의 focus 단위는 cell. useRovingTabIndex 의 default 계산을 cell 차원에서 하도록
  // 첫 row id 를 focus-container 로 전달 (containerId 자체는 ROOT/grid id 그대로 의미).
  const focusContainerId = rowIds[0] ?? containerId

  const { focusId, bindFocus, delegate } = useRovingTabIndex(
    multiSelectable ? multiAxis : baseAxis,
    data,
    onEvent ?? (() => {}),
    { autoFocus, containerId: focusContainerId },
  )
  const rows = rowIds.map((rowId, rowIndex) => {
    const cellIds = getChildren(data, rowId)
    const cells: GridCell[] = cellIds.map((cellId, colIndex) => ({
      id: cellId,
      rowId,
      rowIndex,
      colIndex,
      label: getLabel(data, cellId),
      selected: Boolean(data.entities[cellId]?.selected),
      disabled: isDisabled(data, cellId),
    }))
    return { id: rowId, cells }
  })

  const cellIndex = useCallback(
    (cellId: string): { row: number; col: number } | null => {
      for (const row of rows) {
        const c = row.cells.find((cell) => cell.id === cellId)
        if (c) return { row: c.rowIndex, col: c.colIndex }
      }
      return null
    },
    [rows],
  )

  const rootProps: RootProps = {
    role: 'grid',
    'aria-readonly': readOnly || undefined,
    'aria-rowcount': rowCount,
    'aria-colcount': colCount,
    'aria-multiselectable': multiSelectable || undefined,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as unknown as RootProps

  const rowProps = (id: string): ItemProps => {
    const idx = rowIds.indexOf(id)
    return {
      role: 'row',
      'data-row-id': id,
      'aria-rowindex': idx === -1 ? undefined : idx + 1,
    } as unknown as ItemProps
  }

  const headerCellProps = (role: 'columnheader' | 'rowheader') => (id: string): ItemProps => {
    const idx = cellIndex(id)
    const isFocus = focusId === id
    // aria-sort 은 sort 가 활성된 헤더에만. entity.sort 에 'ascending'|'descending'|'other' 일 때만 emit.
    const sort = data.entities[id]?.sort as 'ascending' | 'descending' | 'other' | 'none' | undefined
    const ariaSort = sort && sort !== 'none' ? sort : undefined
    return {
      role,
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-colindex': idx ? idx.col + 1 : undefined,
      'aria-rowindex': idx ? idx.row + 1 : undefined,
      'aria-sort': ariaSort,
    } as unknown as ItemProps
  }

  const columnHeaderProps = headerCellProps('columnheader')
  const rowHeaderProps = headerCellProps('rowheader')

  const cellProps = (id: string): ItemProps => {
    const idx = cellIndex(id)
    const isFocus = focusId === id
    const cell = idx ? rows[idx.row].cells[idx.col] : undefined
    return {
      role: 'gridcell',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-selected': cell?.selected ?? undefined,
      'aria-disabled': cell?.disabled || undefined,
      'aria-colindex': idx ? idx.col + 1 : undefined,
      'aria-rowindex': idx ? idx.row + 1 : undefined,
      'data-selected': cell?.selected ? '' : undefined,
      'data-disabled': cell?.disabled ? '' : undefined,
      'data-focus-visible': isFocus ? '' : undefined,
    } as unknown as ItemProps
  }

  return { rootProps, rowProps, columnHeaderProps, rowHeaderProps, cellProps, rows }
}

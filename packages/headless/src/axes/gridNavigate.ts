import { fromKeyMap, type Axis } from './axis'
import { parentOf } from './index'
import { getChildren, type NormalizedData } from '../types'
import { INTENTS } from './keys'

/**
 * gridNavigate — APG `/grid/` 2D 셀 단위 navigation. focus 는 cell 에 있다.
 * Selection rect (Shift+Arrow / Ctrl+Space col / Shift+Space row) 은 gridMultiSelect.
 * https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * Intent-form (PRD #38 phase 3b): chord → `{type:'navigate', dir}` 만 emit.
 * 2D 좌표 산수는 reducer (`resolveNavigate`) 가 담당.
 *
 * data 모델:
 *   container (= ROOT 또는 containerId)
 *     ├─ row entity → cell entity (focus 는 cell)
 */

interface Coord {
  cellsInRow: string[]
  colIdx: number
  rows: string[]
  rowIdx: number
}

export const gridCoord = (d: NormalizedData, id: string): Coord | null => {
  const rowId = parentOf(d, id)
  if (!rowId) return null
  const cellsInRow = getChildren(d, rowId)
  const colIdx = cellsInRow.indexOf(id)
  if (colIdx === -1) return null
  const gridId = parentOf(d, rowId)
  if (!gridId) return null
  const rows = getChildren(d, gridId)
  const rowIdx = rows.indexOf(rowId)
  if (rowIdx === -1) return null
  return { cellsInRow, colIdx, rows, rowIdx }
}

export const gridNavigate: Axis = fromKeyMap([
  [INTENTS.gridNavigate.left,      { type: 'navigate', dir: 'gridLeft' }],
  [INTENTS.gridNavigate.right,     { type: 'navigate', dir: 'gridRight' }],
  [INTENTS.gridNavigate.up,        { type: 'navigate', dir: 'gridUp' }],
  [INTENTS.gridNavigate.down,      { type: 'navigate', dir: 'gridDown' }],
  [INTENTS.gridNavigate.rowStart,  { type: 'navigate', dir: 'rowStart' }],
  [INTENTS.gridNavigate.rowEnd,    { type: 'navigate', dir: 'rowEnd' }],
  [INTENTS.gridNavigate.gridStart, { type: 'navigate', dir: 'gridStart' }],
  [INTENTS.gridNavigate.gridEnd,   { type: 'navigate', dir: 'gridEnd' }],
])

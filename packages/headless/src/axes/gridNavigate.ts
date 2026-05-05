import { fromKeyMap, type Axis, type KeyHandler } from './axis'
import { parentOf } from './index'
import { getChildren, type NormalizedData } from '../types'
import { INTENTS } from './keys'

/**
 * gridNavigate — APG `/grid/` 2D 셀 단위 navigation. focus 는 cell 에 있다.
 * Selection rect (Shift+Arrow / Ctrl+Space col / Shift+Space row) 은 gridMultiSelect.
 * https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * KeyMap form — chord 매핑은 fromKeyMap, 2D 좌표 산수는 KeyHandler 캡슐화.
 *
 * data 모델:
 *   container (= ROOT 또는 containerId)
 *     ├─ row entity → cell entity (focus 는 cell)
 *
 * 키 매핑 (data grid model, no wrap):
 *   ArrowLeft/Right  : 같은 row 의 prev/next cell. 양 끝에서 정지.
 *   ArrowUp/Down     : 인접 row 의 같은 column index cell. 양 끝에서 정지.
 *   Home / End       : 현재 row 의 첫/끝 cell.
 *   Ctrl+Home / End  : grid 의 첫 row 첫 cell / 끝 row 끝 cell.
 *
 * column index 가 인접 row 보다 클 경우 가능한 마지막 cell 로 clamp.
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

const inRow = (pick: (c: Coord) => string | undefined): KeyHandler => (d, id) => {
  const c = gridCoord(d, id)
  if (!c) return null
  const target = pick(c)
  return target ? [{ type: 'navigate', id: target }] : null
}

const intoAdjacentRow = (delta: number): KeyHandler => (d, id) => {
  const c = gridCoord(d, id)
  if (!c) return null
  const targetRow = c.rowIdx + delta
  if (targetRow < 0 || targetRow >= c.rows.length) return null
  const cells = getChildren(d, c.rows[targetRow])
  if (!cells.length) return null
  return [{ type: 'navigate', id: cells[Math.min(c.colIdx, cells.length - 1)] }]
}

export const gridNavigate: Axis = fromKeyMap([
  [INTENTS.gridNavigate.left, inRow((c) => c.colIdx > 0 ? c.cellsInRow[c.colIdx - 1] : undefined)],
  [INTENTS.gridNavigate.right, inRow((c) => c.colIdx < c.cellsInRow.length - 1 ? c.cellsInRow[c.colIdx + 1] : undefined)],
  [INTENTS.gridNavigate.up, intoAdjacentRow(-1)],
  [INTENTS.gridNavigate.down, intoAdjacentRow(+1)],
  [INTENTS.gridNavigate.rowStart, inRow((c) => c.cellsInRow[0])],
  [INTENTS.gridNavigate.rowEnd, inRow((c) => c.cellsInRow[c.cellsInRow.length - 1])],
  [INTENTS.gridNavigate.gridStart, (d, id) => {
    const c = gridCoord(d, id)
    if (!c) return null
    const first = getChildren(d, c.rows[0])
    return first[0] ? [{ type: 'navigate', id: first[0] }] : null
  }],
  [INTENTS.gridNavigate.gridEnd, (d, id) => {
    const c = gridCoord(d, id)
    if (!c) return null
    const last = getChildren(d, c.rows[c.rows.length - 1])
    return last.length ? [{ type: 'navigate', id: last[last.length - 1] }] : null
  }],
])

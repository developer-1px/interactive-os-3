import type { Axis } from './axis'
import { parentOf } from './index'
import { getChildren } from '../types'
import { INTENTS, matchChord } from './keys'

/**
 * gridNavigate — APG `/grid/` 2D 셀 단위 navigation. focus 는 cell 에 있다.
 * Selection rect (Shift+Arrow / Ctrl+Space col / Shift+Space row) 은 gridMultiSelect.
 * https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * data 모델:
 *   container (= ROOT 또는 containerId)
 *     ├─ row entity
 *     │    ├─ cell entity
 *     │    ├─ cell entity
 *     │    ⋮
 *     ├─ row entity
 *     ⋮
 *
 * focus 는 cell 에 있다 (treegrid 의 row focus 와 다름).
 *
 * 키 매핑 (data grid model, no wrap):
 *   ArrowLeft/Right  : 같은 row 의 prev/next cell. 양 끝에서 정지.
 *   ArrowUp/Down     : 인접 row 의 같은 column index cell. 양 끝에서 정지.
 *   Home / End       : 현재 row 의 첫/끝 cell.
 *   Ctrl+Home / End  : grid 의 첫 row 첫 cell / 끝 row 끝 cell.
 *
 * column index 가 인접 row 보다 클 경우 가능한 마지막 cell 로 clamp (sparse row 대응).
 */
export const gridNavigate: Axis = (d, id, t) => {
  if (t.kind !== 'key') return null
  const k = t

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

  const I = INTENTS.gridNavigate

  if (matchChord(k, I.left)) {
    if (colIdx === 0) return null
    return [{ type: 'navigate', id: cellsInRow[colIdx - 1] }]
  }
  if (matchChord(k, I.right)) {
    if (colIdx >= cellsInRow.length - 1) return null
    return [{ type: 'navigate', id: cellsInRow[colIdx + 1] }]
  }
  if (matchChord(k, I.up)) {
    if (rowIdx === 0) return null
    const prevCells = getChildren(d, rows[rowIdx - 1])
    if (!prevCells.length) return null
    return [{ type: 'navigate', id: prevCells[Math.min(colIdx, prevCells.length - 1)] }]
  }
  if (matchChord(k, I.down)) {
    if (rowIdx >= rows.length - 1) return null
    const nextCells = getChildren(d, rows[rowIdx + 1])
    if (!nextCells.length) return null
    return [{ type: 'navigate', id: nextCells[Math.min(colIdx, nextCells.length - 1)] }]
  }
  if (matchChord(k, I.gridStart)) {
    const firstCells = getChildren(d, rows[0])
    return firstCells[0] ? [{ type: 'navigate', id: firstCells[0] }] : null
  }
  if (matchChord(k, I.gridEnd)) {
    const lastCells = getChildren(d, rows[rows.length - 1])
    return lastCells.length
      ? [{ type: 'navigate', id: lastCells[lastCells.length - 1] }]
      : null
  }
  if (matchChord(k, I.rowStart)) {
    return [{ type: 'navigate', id: cellsInRow[0] }]
  }
  if (matchChord(k, I.rowEnd)) {
    return [{ type: 'navigate', id: cellsInRow[cellsInRow.length - 1] }]
  }
  return null
}

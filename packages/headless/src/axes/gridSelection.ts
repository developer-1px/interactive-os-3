import type { Axis } from './axis'
import { parentOf } from './index'
import { getChildren, getSelectAnchor, type UiEvent } from '../types'

/**
 * gridSelection — APG `/grid/` Selection 키 매핑.
 * https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * 입력 단위 = 현재 focus 된 cell. data 모델은 gridNavigate 와 동일 (container → row → cell).
 *
 * 키 매핑:
 *   Ctrl+Space   : 현재 cell 의 column 전체(모든 row 의 같은 colIdx cell) 선택
 *   Shift+Space  : 현재 cell 의 row 전체 선택
 *   Ctrl/Meta+A  : 모든 cell 선택
 *   Ctrl/Meta+클릭: 단일 cell toggle
 *   Shift+Arrow  : SELECT_ANCHOR(없으면 현재 cell)→ 다음 cell 을 두 모서리로 하는 사각형 영역 selectMany.
 *                  multiSelect 의 1D anchor-range 와 의미 일관 — 범위 밖은 deselect.
 */
export const gridSelection: Axis = (d, id, t) => {
  const rowId = parentOf(d, id)
  if (!rowId) return null
  const gridId = parentOf(d, rowId)
  if (!gridId) return null
  const rows = getChildren(d, gridId)

  if (t.kind === 'click') {
    if (t.ctrl || t.meta) return [{ type: 'select', id }]
    return null
  }
  if (t.kind !== 'key') return null

  const space = t.key === ' ' || t.key === 'Spacebar'

  if (t.ctrl && space) {
    const cellsInRow = getChildren(d, rowId)
    const colIdx = cellsInRow.indexOf(id)
    if (colIdx < 0) return null
    const ids: string[] = []
    rows.forEach((rid) => {
      const cells = getChildren(d, rid)
      if (cells[colIdx]) ids.push(cells[colIdx])
    })
    return [{ type: 'selectMany', ids, to: true }]
  }

  if (t.shift && space) {
    const cellsInRow = getChildren(d, rowId)
    return [{ type: 'selectMany', ids: cellsInRow, to: true }]
  }

  if ((t.ctrl || t.meta) && (t.key === 'a' || t.key === 'A')) {
    const all: string[] = []
    rows.forEach((rid) => {
      getChildren(d, rid).forEach((cid) => all.push(cid))
    })
    return [{ type: 'selectMany', ids: all, to: true }]
  }

  if (t.shift && (t.key === 'ArrowLeft' || t.key === 'ArrowRight' || t.key === 'ArrowUp' || t.key === 'ArrowDown')) {
    return shiftArrowRange(d, id, t.key, rowId, rows)
  }

  // 단일 Space (no modifier) = 현재 cell toggle
  if (space) return [{ type: 'select', id }] satisfies UiEvent[]

  return null
}

const shiftArrowRange = (
  d: import('../types').NormalizedData,
  currentId: string,
  arrowKey: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown',
  rowId: string,
  rows: string[],
): UiEvent[] | null => {
  const cellsInRow = getChildren(d, rowId)
  const colIdx = cellsInRow.indexOf(currentId)
  const rowIdx = rows.indexOf(rowId)
  if (colIdx < 0 || rowIdx < 0) return null

  let nextRowIdx = rowIdx
  let nextColIdx = colIdx
  if (arrowKey === 'ArrowLeft') nextColIdx = Math.max(0, colIdx - 1)
  else if (arrowKey === 'ArrowRight') nextColIdx = Math.min(cellsInRow.length - 1, colIdx + 1)
  else if (arrowKey === 'ArrowUp') nextRowIdx = Math.max(0, rowIdx - 1)
  else if (arrowKey === 'ArrowDown') nextRowIdx = Math.min(rows.length - 1, rowIdx + 1)
  if (nextRowIdx === rowIdx && nextColIdx === colIdx) return null

  const nextCells = getChildren(d, rows[nextRowIdx])
  if (!nextCells.length) return null
  const nextColInTargetRow = Math.min(nextColIdx, nextCells.length - 1)
  const nextCellId = nextCells[nextColInTargetRow]

  const findCoords = (cellId: string): { row: number; col: number } | null => {
    for (let r = 0; r < rows.length; r++) {
      const cells = getChildren(d, rows[r])
      const c = cells.indexOf(cellId)
      if (c >= 0) return { row: r, col: c }
    }
    return null
  }

  const anchorId = getSelectAnchor(d) ?? currentId
  const anchor = findCoords(anchorId) ?? { row: rowIdx, col: colIdx }
  const next = { row: nextRowIdx, col: nextColInTargetRow }

  const r1 = Math.min(anchor.row, next.row)
  const r2 = Math.max(anchor.row, next.row)
  const c1 = Math.min(anchor.col, next.col)
  const c2 = Math.max(anchor.col, next.col)

  const inRange: string[] = []
  const outRange: string[] = []
  for (let r = 0; r < rows.length; r++) {
    const cells = getChildren(d, rows[r])
    for (let c = 0; c < cells.length; c++) {
      const cid = cells[c]
      const inside = r >= r1 && r <= r2 && c >= c1 && c <= c2
      if (inside) inRange.push(cid)
      else outRange.push(cid)
    }
  }

  const events: UiEvent[] = [{ type: 'navigate', id: nextCellId }]
  if (outRange.length) events.push({ type: 'selectMany', ids: outRange, to: false })
  events.push({ type: 'selectMany', ids: inRange, to: true })
  return events
}

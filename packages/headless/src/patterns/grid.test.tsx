import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGridPattern } from './grid'
import type { NormalizedData } from '../types'

const grid3x2 = (): NormalizedData => ({
  entities: {
    r1: {}, r2: {}, r3: {},
    a: { label: 'A' },
    b: { label: 'B' },
    c: { label: 'C' },
    d: { label: 'D' },
    e: { label: 'E' },
    f: { label: 'F' },
  },
  relationships: {
    r1: ['a', 'b'], r2: ['c', 'd'], r3: ['e', 'f'],
  },
  meta: { root: ['r1', 'r2', 'r3'] },
})

describe('useGridPattern', () => {
  it('rootProps: role=grid + aria-rowcount/colcount/readonly/multiselectable', () => {
    const { result } = renderHook(() => useGridPattern(grid3x2(), undefined, {
      rowCount: 3, colCount: 2, readOnly: true, multiSelectable: true,
    }))
    const root = result.current.rootProps as unknown as Record<string, unknown>
    expect(root.role).toBe('grid')
    expect(root['aria-rowcount']).toBe(3)
    expect(root['aria-colcount']).toBe(2)
    expect(root['aria-readonly']).toBe(true)
    expect(root['aria-multiselectable']).toBe(true)
  })

  it('rootProps: aria-multiselectable omitted when false', () => {
    const { result } = renderHook(() => useGridPattern(grid3x2()))
    expect((result.current.rootProps as unknown as Record<string, unknown>)['aria-multiselectable']).toBeUndefined()
  })

  it('rows view contains row+cell hierarchy with indices', () => {
    const { result } = renderHook(() => useGridPattern(grid3x2()))
    expect(result.current.rows.length).toBe(3)
    const row1 = result.current.rows[0]
    expect(row1.id).toBe('r1')
    expect(row1.cells.map((c) => [c.id, c.rowIndex, c.colIndex, c.label])).toEqual([
      ['a', 0, 0, 'A'],
      ['b', 0, 1, 'B'],
    ])
  })

  it('rowProps: role=row + aria-rowindex (1-based)', () => {
    const { result } = renderHook(() => useGridPattern(grid3x2()))
    const r2 = result.current.rowProps('r2') as unknown as Record<string, unknown>
    expect(r2.role).toBe('row')
    expect(r2['aria-rowindex']).toBe(2)
  })

  it('cellProps: role=gridcell + aria-colindex/rowindex (1-based) + tabIndex roving', () => {
    const { result } = renderHook(() => useGridPattern(grid3x2(), undefined, { autoFocus: true }))
    // First enabled cell becomes focus default → 'a'
    const a = result.current.cellProps('a') as unknown as Record<string, unknown>
    const f = result.current.cellProps('f') as unknown as Record<string, unknown>
    expect(a.role).toBe('gridcell')
    expect(a['aria-colindex']).toBe(1)
    expect(a['aria-rowindex']).toBe(1)
    expect(a.tabIndex).toBe(0) // focused
    expect(f['aria-colindex']).toBe(2)
    expect(f['aria-rowindex']).toBe(3)
    expect(f.tabIndex).toBe(-1) // not focused
  })

  it('columnHeaderProps + rowHeaderProps emit correct role', () => {
    const { result } = renderHook(() => useGridPattern(grid3x2()))
    expect((result.current.columnHeaderProps('a') as unknown as Record<string, unknown>).role).toBe('columnheader')
    expect((result.current.rowHeaderProps('a') as unknown as Record<string, unknown>).role).toBe('rowheader')
  })

  it('selected cell sets aria-selected + data-selected', () => {
    const data = grid3x2()
    data.entities.b = { ...(data.entities.b ?? {}), selected: true }
    const { result } = renderHook(() => useGridPattern(data))
    const b = result.current.cellProps('b') as unknown as Record<string, unknown>
    expect(b['aria-selected']).toBe(true)
    expect(b['data-selected']).toBe('')
  })

  it('disabled cell sets aria-disabled + data-disabled', () => {
    const data = grid3x2()
    data.entities.b = { ...(data.entities.b ?? {}), disabled: true }
    const { result } = renderHook(() => useGridPattern(data))
    const b = result.current.cellProps('b') as unknown as Record<string, unknown>
    expect(b['aria-disabled']).toBe(true)
    expect(b['data-disabled']).toBe('')
  })

  it('label / labelledBy opts → aria-label / aria-labelledby on root', () => {
    const { result: r1 } = renderHook(() => useGridPattern(grid3x2(), undefined, { label: 'Q1 Sales' }))
    expect((r1.current.rootProps as unknown as Record<string, unknown>)['aria-label']).toBe('Q1 Sales')
    const { result: r2 } = renderHook(() => useGridPattern(grid3x2(), undefined, { labelledBy: 'h-id' }))
    expect((r2.current.rootProps as unknown as Record<string, unknown>)['aria-labelledby']).toBe('h-id')
  })

  it('columnHeader aria-sort emitted only when entity.sort is ascending/descending/other', () => {
    const data = grid3x2()
    data.entities.a = { ...(data.entities.a ?? {}), sort: 'ascending' }
    data.entities.b = { ...(data.entities.b ?? {}), sort: 'none' }
    const { result } = renderHook(() => useGridPattern(data))
    const aHeader = result.current.columnHeaderProps('a') as unknown as Record<string, unknown>
    const bHeader = result.current.columnHeaderProps('b') as unknown as Record<string, unknown>
    const cHeader = result.current.columnHeaderProps('c') as unknown as Record<string, unknown>
    expect(aHeader['aria-sort']).toBe('ascending')
    expect(bHeader['aria-sort']).toBeUndefined() // 'none' → omit
    expect(cHeader['aria-sort']).toBeUndefined()
  })
})

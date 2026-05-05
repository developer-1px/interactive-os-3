import { describe, expect, it } from 'vitest'
import { gridNavigate } from './gridNavigate'
import type { NormalizedData } from '../types'
import { grid3x3 } from './_fixtures'

const k = (key: string, mods: { ctrl?: boolean; shift?: boolean; meta?: boolean } = {}): string => {
  const parts: string[] = []
  if (mods.ctrl)  parts.push('Control')
  if (mods.meta)  parts.push('Meta')
  if (mods.shift) parts.push('Shift')
  parts.push(key === ' ' ? 'Space' : key)
  return parts.join('+')
}

describe('gridNavigate axis', () => {
  const d = grid3x3()

  it('ArrowRight moves to next cell in row', () => {
    expect(gridNavigate(d, 'c22', k('ArrowRight'))).toEqual([{ type: 'navigate', id: 'c23' }])
  })

  it('ArrowLeft moves to prev cell in row', () => {
    expect(gridNavigate(d, 'c22', k('ArrowLeft'))).toEqual([{ type: 'navigate', id: 'c21' }])
  })

  it('ArrowDown moves to same column in next row', () => {
    expect(gridNavigate(d, 'c12', k('ArrowDown'))).toEqual([{ type: 'navigate', id: 'c22' }])
  })

  it('ArrowUp moves to same column in prev row', () => {
    expect(gridNavigate(d, 'c32', k('ArrowUp'))).toEqual([{ type: 'navigate', id: 'c22' }])
  })

  it('does not wrap at right edge', () => {
    expect(gridNavigate(d, 'c13', k('ArrowRight'))).toBeNull()
  })

  it('does not wrap at left edge', () => {
    expect(gridNavigate(d, 'c11', k('ArrowLeft'))).toBeNull()
  })

  it('does not wrap at top edge', () => {
    expect(gridNavigate(d, 'c11', k('ArrowUp'))).toBeNull()
  })

  it('does not wrap at bottom edge', () => {
    expect(gridNavigate(d, 'c33', k('ArrowDown'))).toBeNull()
  })

  it('Home moves to first cell in current row', () => {
    expect(gridNavigate(d, 'c23', k('Home'))).toEqual([{ type: 'navigate', id: 'c21' }])
  })

  it('End moves to last cell in current row', () => {
    expect(gridNavigate(d, 'c21', k('End'))).toEqual([{ type: 'navigate', id: 'c23' }])
  })

  it('Ctrl+Home moves to first cell of first row', () => {
    expect(gridNavigate(d, 'c33', k('Home', { ctrl: true }))).toEqual([{ type: 'navigate', id: 'c11' }])
  })

  it('Ctrl+End moves to last cell of last row', () => {
    expect(gridNavigate(d, 'c11', k('End', { ctrl: true }))).toEqual([{ type: 'navigate', id: 'c33' }])
  })

  it('clamps column when target row is shorter (sparse)', () => {
    const sparse: NormalizedData = {
      entities: { r1: {}, r2: {}, a: {}, b: {}, c: {}, d: {} },
      relationships: {
        r1: ['a', 'b', 'c'],   // 3 cells
        r2: ['d'],              // 1 cell
      },
      meta: { root: ['r1', 'r2'] },
    }
    // From c (col 2) ArrowDown into r2 → r2 only has 1 cell, clamp to col 0
    expect(gridNavigate(sparse, 'c', k('ArrowDown'))).toEqual([{ type: 'navigate', id: 'd' }])
  })

  it('returns null for non-key triggers', () => {
    expect(gridNavigate(d, 'c22', 'Click')).toBeNull()
  })

  it('returns null for unrelated keys', () => {
    expect(gridNavigate(d, 'c22', k('Enter'))).toBeNull()
    expect(gridNavigate(d, 'c22', k('PageDown'))).toBeNull()
  })
})

import { describe, expect, it } from 'vitest'
import { gridNavigate } from './gridNavigate'
import { grid3x3 } from './_fixtures'

const k = (key: string, mods: { ctrl?: boolean; shift?: boolean; meta?: boolean } = {}): string => {
  const parts: string[] = []
  if (mods.ctrl)  parts.push('Control')
  if (mods.meta)  parts.push('Meta')
  if (mods.shift) parts.push('Shift')
  parts.push(key === ' ' ? 'Space' : key)
  return parts.join('+')
}

describe('gridNavigate axis (intent-form)', () => {
  const d = grid3x3()

  it('emits dir:gridRight on ArrowRight', () => {
    expect(gridNavigate(d, 'c22', k('ArrowRight'))).toEqual([{ type: 'navigate', id: 'c22', dir: 'gridRight' }])
  })

  it('emits dir:gridLeft on ArrowLeft', () => {
    expect(gridNavigate(d, 'c22', k('ArrowLeft'))).toEqual([{ type: 'navigate', id: 'c22', dir: 'gridLeft' }])
  })

  it('emits dir:gridDown on ArrowDown', () => {
    expect(gridNavigate(d, 'c12', k('ArrowDown'))).toEqual([{ type: 'navigate', id: 'c12', dir: 'gridDown' }])
  })

  it('emits dir:gridUp on ArrowUp', () => {
    expect(gridNavigate(d, 'c32', k('ArrowUp'))).toEqual([{ type: 'navigate', id: 'c32', dir: 'gridUp' }])
  })

  it('emits dir:rowStart on Home, dir:rowEnd on End', () => {
    expect(gridNavigate(d, 'c23', k('Home'))).toEqual([{ type: 'navigate', id: 'c23', dir: 'rowStart' }])
    expect(gridNavigate(d, 'c21', k('End'))).toEqual([{ type: 'navigate', id: 'c21', dir: 'rowEnd' }])
  })

  it('emits dir:gridStart on Ctrl+Home, dir:gridEnd on Ctrl+End', () => {
    expect(gridNavigate(d, 'c33', k('Home', { ctrl: true }))).toEqual([{ type: 'navigate', id: 'c33', dir: 'gridStart' }])
    expect(gridNavigate(d, 'c11', k('End', { ctrl: true }))).toEqual([{ type: 'navigate', id: 'c11', dir: 'gridEnd' }])
  })

  it('returns null for non-key triggers', () => {
    expect(gridNavigate(d, 'c22', 'Click')).toBeNull()
  })

  it('returns null for unrelated keys', () => {
    expect(gridNavigate(d, 'c22', k('Enter'))).toBeNull()
    expect(gridNavigate(d, 'c22', k('PageDown'))).toBeNull()
  })
})

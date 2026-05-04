import { describe, expect, it } from 'vitest'
import { gridMultiSelect } from './gridMultiSelect'
import { keyTrigger, clickTrigger } from '../trigger'
import type { NormalizedData } from '../types'
import { grid3x3 } from './_fixtures'

const key = (k: string, mods: { ctrl?: boolean; shift?: boolean; meta?: boolean } = {}) =>
  keyTrigger({ key: k, ctrl: false, shift: false, meta: false, alt: false, ...mods })

describe('gridMultiSelect axis', () => {
  const d = grid3x3()

  it('Ctrl+Space selects entire column at focused cell', () => {
    expect(gridMultiSelect(d, 'c22', key(' ', { ctrl: true }))).toEqual([
      { type: 'selectMany', ids: ['c12', 'c22', 'c32'], to: true },
    ])
  })

  it('Shift+Space selects entire row at focused cell', () => {
    expect(gridMultiSelect(d, 'c22', key(' ', { shift: true }))).toEqual([
      { type: 'selectMany', ids: ['c21', 'c22', 'c23'], to: true },
    ])
  })

  it('Ctrl+A selects all cells', () => {
    const result = gridMultiSelect(d, 'c11', key('a', { ctrl: true }))
    expect(result).toEqual([
      { type: 'selectMany', ids: ['c11', 'c12', 'c13', 'c21', 'c22', 'c23', 'c31', 'c32', 'c33'], to: true },
    ])
  })

  it('Meta+A also selects all (mac convention)', () => {
    expect(gridMultiSelect(d, 'c11', key('A', { meta: true }))).toEqual([
      { type: 'selectMany', ids: ['c11', 'c12', 'c13', 'c21', 'c22', 'c23', 'c31', 'c32', 'c33'], to: true },
    ])
  })

  it('plain Space toggles current cell', () => {
    expect(gridMultiSelect(d, 'c22', key(' '))).toEqual([{ type: 'select', id: 'c22' }])
  })

  it('Ctrl+Click toggles individual cell', () => {
    expect(gridMultiSelect(d, 'c22', clickTrigger({ ctrl: true }))).toEqual([{ type: 'select', id: 'c22' }])
  })

  it('Meta+Click toggles individual cell', () => {
    expect(gridMultiSelect(d, 'c22', clickTrigger({ meta: true }))).toEqual([{ type: 'select', id: 'c22' }])
  })

  it('plain click yields null (consumer handles via gridNavigate or focus)', () => {
    expect(gridMultiSelect(d, 'c22', clickTrigger())).toBeNull()
  })

  it('returns null for unrelated keys', () => {
    expect(gridMultiSelect(d, 'c22', key('Enter'))).toBeNull()
    expect(gridMultiSelect(d, 'c22', key('ArrowRight'))).toBeNull()
  })

  it('returns null when cell is not in any row (orphan id)', () => {
    expect(gridMultiSelect(d, 'unknown', key(' ', { ctrl: true }))).toBeNull()
  })

  describe('Shift+Arrow 2D range', () => {
    it('with no anchor — Shift+ArrowRight from c22 → range (c22,c23) selected, others deselected, focus → c23', () => {
      const result = gridMultiSelect(d, 'c22', key('ArrowRight', { shift: true }))
      expect(result?.[0]).toEqual({ type: 'navigate', id: 'c23' })
      // outRange = all cells outside r2 cols 1..2
      const inEvent = result?.find((e) => e.type === 'selectMany' && e.to === true)
      const outEvent = result?.find((e) => e.type === 'selectMany' && e.to === false)
      expect(inEvent).toEqual({ type: 'selectMany', ids: ['c22', 'c23'], to: true })
      expect((outEvent as { ids: string[] }).ids.sort()).toEqual(
        ['c11', 'c12', 'c13', 'c21', 'c31', 'c32', 'c33'].sort(),
      )
    })

    it('with anchor at c11 — Shift+ArrowDown from c12 selects rectangle [r1..r2 × c11..c12]', () => {
      const dWithAnchor: NormalizedData = {
        ...d,
        meta: { ...d.meta, selectAnchor: 'c11' },
      }
      const result = gridMultiSelect(dWithAnchor, 'c12', key('ArrowDown', { shift: true }))
      expect(result?.[0]).toEqual({ type: 'navigate', id: 'c22' })
      const inEvent = result?.find((e) => e.type === 'selectMany' && e.to === true) as { ids: string[] }
      // anchor (0,0) → next (1,1): rectangle = c11, c12, c21, c22
      expect(inEvent.ids.sort()).toEqual(['c11', 'c12', 'c21', 'c22'].sort())
    })

    it('Shift+Arrow at edge does not move (no events)', () => {
      expect(gridMultiSelect(d, 'c11', key('ArrowLeft', { shift: true }))).toBeNull()
      expect(gridMultiSelect(d, 'c11', key('ArrowUp', { shift: true }))).toBeNull()
      expect(gridMultiSelect(d, 'c33', key('ArrowRight', { shift: true }))).toBeNull()
      expect(gridMultiSelect(d, 'c33', key('ArrowDown', { shift: true }))).toBeNull()
    })

    it('plain Arrow (no shift) yields null — gridNavigate handles it', () => {
      expect(gridMultiSelect(d, 'c22', key('ArrowRight'))).toBeNull()
    })
  })
})

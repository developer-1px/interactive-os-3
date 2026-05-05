import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { KEYS } from './keys'
import { treeNavigate } from './treeNavigate'

const data: NormalizedData = {
  entities: {
    a: { id: 'a' }, b: { id: 'b' },
    a1: { id: 'a1' }, a2: { id: 'a2' },
    a1x: { id: 'a1x' },
  },
  relationships: {
    a: ['a1', 'a2'],
    a1: ['a1x'],
  },
  meta: { root: ['a', 'b'], expanded: ['a', 'a1'] },
}

const key = (k: string) => k

describe('treeNavigate axis', () => {
  it('emits dir:visibleNext on ArrowDown', () => {
    expect(treeNavigate(data, 'a', key(KEYS.ArrowDown))).toEqual([{ type: 'navigate', id: 'a', dir: 'visibleNext' }])
  })

  it('emits dir:visiblePrev on ArrowUp', () => {
    expect(treeNavigate(data, 'a1x', key(KEYS.ArrowUp))).toEqual([{ type: 'navigate', id: 'a1x', dir: 'visiblePrev' }])
  })

  it('emits dir:start on Home, dir:end on End', () => {
    expect(treeNavigate(data, 'b', key(KEYS.Home))).toEqual([{ type: 'navigate', id: 'b', dir: 'start' }])
    expect(treeNavigate(data, 'a', key(KEYS.End))).toEqual([{ type: 'navigate', id: 'a', dir: 'end' }])
  })

  it('returns null on non-matching key', () => {
    expect(treeNavigate(data, 'a', key(KEYS.Enter))).toBeNull()
  })
})

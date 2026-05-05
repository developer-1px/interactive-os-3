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
  it('ArrowDown moves to next visible (DFS, collapse-aware)', () => {
    expect(treeNavigate(data, 'a', key(KEYS.ArrowDown))).toEqual([{ type: 'navigate', id: 'a1' }])
    expect(treeNavigate(data, 'a1', key(KEYS.ArrowDown))).toEqual([{ type: 'navigate', id: 'a1x' }])
    expect(treeNavigate(data, 'a1x', key(KEYS.ArrowDown))).toEqual([{ type: 'navigate', id: 'a2' }])
  })

  it('ArrowUp moves to prev visible', () => {
    expect(treeNavigate(data, 'a1x', key(KEYS.ArrowUp))).toEqual([{ type: 'navigate', id: 'a1' }])
  })

  it('clamps at last on ArrowDown', () => {
    expect(treeNavigate(data, 'b', key(KEYS.ArrowDown))).toEqual([{ type: 'navigate', id: 'b' }])
  })

  it('Home jumps to first visible, End to last', () => {
    expect(treeNavigate(data, 'b', key(KEYS.Home))).toEqual([{ type: 'navigate', id: 'a' }])
    expect(treeNavigate(data, 'a', key(KEYS.End))).toEqual([{ type: 'navigate', id: 'b' }])
  })

  it('returns null on non-matching key', () => {
    expect(treeNavigate(data, 'a', key(KEYS.Enter))).toBeNull()
  })
})

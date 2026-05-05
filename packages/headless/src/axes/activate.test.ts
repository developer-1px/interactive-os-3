import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { activate } from './activate'
import { KEYS } from './keys'

const data: NormalizedData = {
  entities: {
    leaf: { id: 'leaf' },
    branch: { id: 'branch' },
    disabled: { id: 'disabled', disabled: true },
  },
  relationships: {
    branch: ['leaf'], // branch has children
  },
  meta: {},
}

const key = (k: string) => k

describe('activate axis', () => {
  it('emits activate on Enter for a leaf', () => {
    expect(activate(data, 'leaf', key(KEYS.Enter))).toEqual([{ type: 'activate', id: 'leaf' }])
  })

  it('emits activate on Space for a leaf', () => {
    expect(activate(data, 'leaf', key(KEYS.Space))).toEqual([{ type: 'activate', id: 'leaf' }])
  })

  it('returns null on Enter for a branch (treeExpand has priority)', () => {
    expect(activate(data, 'branch', key(KEYS.Enter))).toBeNull()
  })

  it('returns null when entity is disabled', () => {
    expect(activate(data, 'disabled', key(KEYS.Enter))).toBeNull()
  })

  it('emits activate on click for any non-disabled entity (branch or leaf)', () => {
    expect(activate(data, 'branch', 'Click')).toEqual([{ type: 'activate', id: 'branch' }])
    expect(activate(data, 'leaf', 'Click')).toEqual([{ type: 'activate', id: 'leaf' }])
  })

  it('returns null on click when disabled', () => {
    expect(activate(data, 'disabled', 'Click')).toBeNull()
  })

  it('returns null on non-matching key', () => {
    expect(activate(data, 'leaf', key(KEYS.ArrowDown))).toBeNull()
  })
})

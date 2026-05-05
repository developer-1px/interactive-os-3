import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { expand } from './expand'
import { KEYS } from './keys'

const data: NormalizedData = {
  entities: {
    branch: { id: 'branch' },
    leaf: { id: 'leaf' },
    disabledBranch: { id: 'disabledBranch', disabled: true },
    branchInBranch: { id: 'branchInBranch' },
  },
  relationships: {
    branch: ['leaf', 'branchInBranch'],
  },
  meta: { focus: 'leaf', root: ['branch', 'disabledBranch'] },
}

const key = (k: string) => k

describe('expand axis', () => {
  it('opens branch + seeds first enabled child on ArrowRight', () => {
    expect(expand(data, 'branch', key(KEYS.ArrowRight))).toEqual([
      { type: 'expand', id: 'branch', open: true },
      { type: 'navigate', id: 'leaf' },
    ])
  })

  it('returns null on ArrowRight for leaf', () => {
    expect(expand(data, 'leaf', key(KEYS.ArrowRight))).toBeNull()
  })

  it('returns null on ArrowRight for disabled branch', () => {
    expect(expand(data, 'disabledBranch', key(KEYS.ArrowRight))).toBeNull()
  })

  it('closes parent + navigates to parent on ArrowLeft', () => {
    expect(expand(data, 'leaf', key(KEYS.ArrowLeft))).toEqual([
      { type: 'expand', id: 'branch', open: false },
      { type: 'navigate', id: 'branch' },
    ])
  })

  it('returns null on ArrowLeft when at top-level', () => {
    expect(expand(data, 'branch', key(KEYS.ArrowLeft))).toBeNull()
  })

  it('returns null on click trigger', () => {
    expect(expand(data, 'branch', 'Click')).toBeNull()
  })
})

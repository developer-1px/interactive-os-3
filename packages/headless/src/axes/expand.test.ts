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

describe('expand axis (intent-form)', () => {
  it('emits expandSeed open on ArrowRight', () => {
    expect(expand(data, 'branch', key(KEYS.ArrowRight))).toEqual([
      { type: 'expandSeed', id: 'branch', dir: 'open' },
    ])
  })

  it('emits expandSeed close on ArrowLeft', () => {
    expect(expand(data, 'leaf', key(KEYS.ArrowLeft))).toEqual([
      { type: 'expandSeed', id: 'leaf', dir: 'close' },
    ])
  })

  it('returns null on click trigger', () => {
    expect(expand(data, 'branch', 'Click')).toBeNull()
  })

  it('returns null on unrelated keys', () => {
    expect(expand(data, 'branch', key(KEYS.Tab))).toBeNull()
  })
})

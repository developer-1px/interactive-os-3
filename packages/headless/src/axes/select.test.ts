import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { KEYS } from './keys'
import { select } from './select'

const data: NormalizedData = {
  entities: {
    a: { id: 'a' },
    dis: { id: 'dis', disabled: true },
  },
  relationships: {},
  meta: {},
}

const key = (k: string) => k

describe('select axis', () => {
  it('emits select on Space chord', () => {
    expect(select(data, 'a', key(KEYS.Space))).toEqual([{ type: 'select', id: 'a' }])
  })

  it('emits select on click', () => {
    expect(select(data, 'a', 'Click')).toEqual([{ type: 'select', id: 'a' }])
  })

  it('returns null when disabled', () => {
    expect(select(data, 'dis', key(KEYS.Space))).toBeNull()
    expect(select(data, 'dis', 'Click')).toBeNull()
  })

  it('returns null on Enter (activate has priority)', () => {
    expect(select(data, 'a', key(KEYS.Enter))).toBeNull()
  })

  it('returns null on non-matching key', () => {
    expect(select(data, 'a', key(KEYS.ArrowDown))).toBeNull()
  })
})

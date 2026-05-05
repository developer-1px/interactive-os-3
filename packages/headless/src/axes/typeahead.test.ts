import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { typeahead } from './typeahead'

const data = (buf = '', deadline = 0): NormalizedData => ({
  entities: {
    apple: { id: 'apple', label: 'Apple' },
    avocado: { id: 'avocado', label: 'Avocado' },
    banana: { id: 'banana', label: 'Banana' },
  },
  relationships: {},
  meta: { root: ['apple', 'avocado', 'banana'], typeahead: { buf, deadline } },
})

const key = (k: string) => ({ kind: 'key' as const, key: k })

describe('typeahead axis', () => {
  it('emits typeahead + navigate to first matching sibling on printable key', () => {
    const out = typeahead(data(), 'apple', key('b'))
    expect(out?.[0]).toMatchObject({ type: 'typeahead', buf: 'b' })
    expect(out?.[1]).toEqual({ type: 'navigate', id: 'banana' })
  })

  it('extends buffer when within deadline window', () => {
    const future = Date.now() + 1000
    const out = typeahead(data('a', future), 'apple', key('v'))
    expect(out?.[0]).toMatchObject({ type: 'typeahead', buf: 'av' })
    expect(out?.[1]).toEqual({ type: 'navigate', id: 'avocado' })
  })

  it('returns typeahead-only (no navigate) when no match', () => {
    const out = typeahead(data(), 'apple', key('z'))
    expect(out).toHaveLength(1)
    expect(out?.[0]).toMatchObject({ type: 'typeahead', buf: 'z' })
  })

  it('returns null on non-printable key', () => {
    expect(typeahead(data(), 'apple', key('Enter'))).toBeNull()
    expect(typeahead(data(), 'apple', key('ArrowDown'))).toBeNull()
  })

  it('returns null on click trigger', () => {
    expect(typeahead(data(), 'apple', { kind: 'click' })).toBeNull()
  })
})

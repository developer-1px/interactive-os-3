import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { multiSelectToggle, singleSelect } from './selection'

const baseData = (entities: Record<string, Record<string, unknown>>): NormalizedData => ({
  entities,
  relationships: { ROOT: Object.keys(entities) },
  meta: {},
})

describe('multiSelectToggle', () => {
  it('select event — single-replace (no longer toggles)', () => {
    const d = baseData({
      a: { id: 'a', selected: false },
      b: { id: 'b', selected: true },
    })
    const next = multiSelectToggle(d, { type: 'select', id: 'a' })
    // select 의미 박제: 그 id 만 true, 나머지 false (사용자 정본).
    expect(next.entities.a?.selected).toBe(true)
    expect(next.entities.b?.selected).toBe(false)
  })

  it('selectMany sets each id to explicit `to`', () => {
    const d = baseData({
      a: { id: 'a', selected: false },
      b: { id: 'b', selected: false },
    })
    const next = multiSelectToggle(d, { type: 'selectMany', ids: ['a', 'b'], to: true })
    expect(next.entities.a?.selected).toBe(true)
    expect(next.entities.b?.selected).toBe(true)
  })

  it('selectMany toggles each id when `to` is omitted', () => {
    const d = baseData({
      a: { id: 'a', selected: true },
      b: { id: 'b', selected: false },
    })
    const next = multiSelectToggle(d, { type: 'selectMany', ids: ['a', 'b'] })
    expect(next.entities.a?.selected).toBe(false)
    expect(next.entities.b?.selected).toBe(true)
  })
})

describe('singleSelect', () => {
  it('selects target id, clears all siblings, moves focus', () => {
    const d = baseData({
      a: { id: 'a', selected: true },
      b: { id: 'b', selected: false },
    })
    const next = singleSelect(d, { type: 'select', id: 'b' })
    expect(next.entities.a?.selected).toBe(false)
    expect(next.entities.b?.selected).toBe(true)
    expect(next.meta?.focus).toBe('b')
  })
})

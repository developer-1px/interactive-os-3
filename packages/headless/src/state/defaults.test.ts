import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { reduceWithDefaults, reduceWithRadio } from './defaults'

const baseData = (entities: Record<string, Record<string, unknown>>): NormalizedData => ({
  entities,
  relationships: { ROOT: Object.keys(entities) },
  meta: {},
})

describe('reduceWithDefaults', () => {
  it('handles check event by toggling entity.checked', () => {
    const d = baseData({ a: { id: 'a' } })
    const next = reduceWithDefaults(d, { type: 'check', id: 'a' })
    expect(next.entities.a?.checked).toBe(true)
  })

  it('handles select event by single-replace (legacy singleSelect)', () => {
    const d = baseData({ a: { id: 'a', selected: true }, b: { id: 'b' } })
    const next = reduceWithDefaults(d, { type: 'select', id: 'b' })
    expect(next.entities.a?.selected).toBe(false)
    expect(next.entities.b?.selected).toBe(true)
  })

  it('check and select coexist on different entities (no conflict)', () => {
    const d = baseData({ a: { id: 'a' }, b: { id: 'b' } })
    const after1 = reduceWithDefaults(d, { type: 'check', id: 'a' })
    const after2 = reduceWithDefaults(after1, { type: 'select', id: 'b' })
    expect(after2.entities.a?.checked).toBe(true)
    expect(after2.entities.b?.selected).toBe(true)
  })
})

describe('reduceWithRadio', () => {
  it('handles check event with single-of-group (radio semantics)', () => {
    const d = baseData({
      a: { id: 'a', checked: true },
      b: { id: 'b', checked: false },
    })
    const next = reduceWithRadio(d, { type: 'check', id: 'b' })
    expect(next.entities.a?.checked).toBe(false)
    expect(next.entities.b?.checked).toBe(true)
  })
})

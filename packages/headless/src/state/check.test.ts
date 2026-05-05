import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { checkToggle, singleCheck } from './check'

const baseData = (entities: Record<string, Record<string, unknown>>): NormalizedData => ({
  entities,
  relationships: { ROOT: Object.keys(entities) },
  meta: {},
})

describe('checkToggle', () => {
  it('toggles entity.checked when `to` is omitted', () => {
    const d = baseData({ a: { id: 'a' } })
    const next = checkToggle(d, { type: 'check', id: 'a' })
    expect(next.entities.a?.checked).toBe(true)
  })

  it('sets entity.checked to explicit `to` regardless of current state', () => {
    const d = baseData({ a: { id: 'a', checked: false } })
    const next = checkToggle(d, { type: 'check', id: 'a', to: false })
    // 토글이라면 true 가 되겠지만, 명시 set 이므로 false 그대로
    expect(next.entities.a?.checked).toBe(false)
  })

  it("sets entity.checked to 'mixed'", () => {
    const d = baseData({ a: { id: 'a', checked: false } })
    const next = checkToggle(d, { type: 'check', id: 'a', to: 'mixed' })
    expect(next.entities.a?.checked).toBe('mixed')
  })

  it('checkMany sets multiple entities with explicit `to`', () => {
    const d = baseData({ a: { id: 'a' }, b: { id: 'b' }, c: { id: 'c' } })
    const next = checkToggle(d, { type: 'checkMany', ids: ['a', 'b'], to: true })
    expect(next.entities.a?.checked).toBe(true)
    expect(next.entities.b?.checked).toBe(true)
    expect(next.entities.c?.checked).toBeUndefined()
  })

  it('checkMany toggles each entity independently when `to` is omitted', () => {
    const d = baseData({ a: { id: 'a', checked: true }, b: { id: 'b', checked: false } })
    const next = checkToggle(d, { type: 'checkMany', ids: ['a', 'b'] })
    expect(next.entities.a?.checked).toBe(false)
    expect(next.entities.b?.checked).toBe(true)
  })
})

describe('singleCheck', () => {
  it('sets the targeted entity checked=true and clears all siblings', () => {
    const d = baseData({
      a: { id: 'a', checked: true },
      b: { id: 'b', checked: false },
      c: { id: 'c', checked: false },
    })
    const next = singleCheck(d, { type: 'check', id: 'b' })
    expect(next.entities.a?.checked).toBe(false)
    expect(next.entities.b?.checked).toBe(true)
    expect(next.entities.c?.checked).toBe(false)
  })

  it('returns the same data when target is already the only checked', () => {
    const d = baseData({
      a: { id: 'a', checked: true },
      b: { id: 'b', checked: false },
    })
    const next = singleCheck(d, { type: 'check', id: 'a' })
    expect(next).toBe(d) // identity — no mutation
  })
})

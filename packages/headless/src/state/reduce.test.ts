/**
 * reduce — selectMany 의 default 의미 검증 (#23).
 * `entities[id].selected` 를 `to` 로 write. `to` undefined 면 토글.
 */
import { describe, expect, it } from 'vitest'
import { reduce } from './reduce'
import type { NormalizedData } from '../types'

const data = (selected: Record<string, boolean | undefined>): NormalizedData => ({
  entities: Object.fromEntries(
    Object.entries(selected).map(([id, sel]) => [id, sel === undefined ? { id } : { id, selected: sel }]),
  ),
  relationships: {},
  meta: {},
})

describe('reduce — selectMany default semantics (#23)', () => {
  it('to:true sets all ids to selected:true', () => {
    const next = reduce(data({ a: false, b: false }), { type: 'selectMany', ids: ['a', 'b'], to: true })
    expect(next.entities.a.selected).toBe(true)
    expect(next.entities.b.selected).toBe(true)
  })

  it('to:false sets all ids to selected:false', () => {
    const next = reduce(data({ a: true, b: true }), { type: 'selectMany', ids: ['a', 'b'], to: false })
    expect(next.entities.a.selected).toBe(false)
    expect(next.entities.b.selected).toBe(false)
  })

  it('to undefined toggles each id', () => {
    const next = reduce(data({ a: true, b: false }), { type: 'selectMany', ids: ['a', 'b'] })
    expect(next.entities.a.selected).toBe(false)
    expect(next.entities.b.selected).toBe(true)
  })

  it('preserves entities not in ids', () => {
    const next = reduce(data({ a: false, b: false, c: true }), { type: 'selectMany', ids: ['a'], to: true })
    expect(next.entities.a.selected).toBe(true)
    expect(next.entities.b.selected).toBe(false)
    expect(next.entities.c.selected).toBe(true)
  })
})

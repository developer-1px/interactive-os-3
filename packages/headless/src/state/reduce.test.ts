/**
 * reduce — core invariant: select/selectMany 는 identity (host territory).
 * 의미는 `singleSelect` / `multiSelectToggle` / `singleCheck` / `checkToggle` 가 합성.
 *
 * #23/#24 가 #37 (PRD: check/select 두 축 분리) 로 superseded — selectMany 의
 * entity-write 책임은 multiSelectToggle 에 단일화. core 는 anchor 만 메타로 갱신.
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

describe('reduce — core invariants', () => {
  it('selectMany is identity in core (host territory)', () => {
    const d = data({ a: false, b: false })
    const next = reduce(d, { type: 'selectMany', ids: ['a', 'b'], to: true })
    expect(next).toBe(d)
  })

  it('check is identity in core (host territory)', () => {
    const d = data({ a: false })
    const next = reduce(d, { type: 'check', id: 'a', to: true })
    expect(next).toBe(d)
  })

  it('checkMany is identity in core (host territory)', () => {
    const d = data({ a: false, b: false })
    const next = reduce(d, { type: 'checkMany', ids: ['a', 'b'], to: true })
    expect(next).toBe(d)
  })

  it('select is identity in core (anchor 갱신은 setAnchor 단일 책임)', () => {
    const d = data({ a: false })
    const next = reduce(d, { type: 'select', id: 'a' })
    expect(next).toBe(d)
  })

  it('setAnchor sets meta.selectAnchor (axis-driven anchor 갱신)', () => {
    const d = data({ a: false })
    const next = reduce(d, { type: 'setAnchor', id: 'a' })
    expect(next.meta?.selectAnchor).toBe('a')
  })
})

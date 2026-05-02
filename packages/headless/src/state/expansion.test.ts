import { describe, expect, it } from 'vitest'
import { singleExpand } from './expansion'
import { fromTree } from './fromTree'
import { EXPANDED, type NormalizedData } from '../types'

const accordion = (expandedIds: string[] = []): NormalizedData =>
  fromTree(
    [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ],
    {
      getId: (n) => n.id,
      toData: (n) => ({ label: n.label }),
      expandedIds,
    },
  )

describe('singleExpand reducer', () => {
  it('collapses sibling entries when one opens', () => {
    const data = accordion(['a'])
    const next = singleExpand(data, { type: 'expand', id: 'b', open: true })
    expect(next.entities[EXPANDED]?.data?.ids).toEqual([])
  })

  it('does not touch state on close (open=false)', () => {
    const data = accordion(['a', 'b'])
    expect(singleExpand(data, { type: 'expand', id: 'a', open: false })).toBe(data)
  })

  it('returns same reference when no siblings are expanded', () => {
    const data = accordion([])
    expect(singleExpand(data, { type: 'expand', id: 'a', open: true })).toBe(data)
  })

  it('returns same reference when only the opening item itself is in expanded set', () => {
    const data = accordion(['b'])
    expect(singleExpand(data, { type: 'expand', id: 'b', open: true })).toBe(data)
  })

  it('does not collapse the item that is being opened', () => {
    const data = accordion(['a', 'b'])
    const next = singleExpand(data, { type: 'expand', id: 'b', open: true })
    expect(next.entities[EXPANDED]?.data?.ids).toEqual(['b'])
  })

  it('ignores non-expand events', () => {
    const data = accordion(['a'])
    expect(singleExpand(data, { type: 'activate', id: 'a' })).toBe(data)
    expect(singleExpand(data, { type: 'select', id: 'a' })).toBe(data)
  })
})

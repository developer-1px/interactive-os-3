import { describe, expect, it } from 'vitest'
import { singleExpand } from './expansion'
import { reduce } from './reduce'
import { fromTree } from './fromTree'
import { EXPANDED, getExpanded, getOpen, type NormalizedData } from '../types'

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

describe('expand vs open meta separation', () => {
  it('expand event tracks EXPANDED set, open event tracks OPEN set', () => {
    const data = accordion()
    const afterExpand = reduce(data, { type: 'expand', id: 'a', open: true })
    expect(getExpanded(afterExpand).has('a')).toBe(true)
    expect(getOpen(afterExpand).has('a')).toBe(false)

    const afterOpen = reduce(data, { type: 'open', id: 'dialog1', open: true })
    expect(getOpen(afterOpen).has('dialog1')).toBe(true)
    expect(getExpanded(afterOpen).has('dialog1')).toBe(false)
  })

  it('OPEN and EXPANDED are independent — no leak between domains', () => {
    let d = accordion()
    d = reduce(d, { type: 'expand', id: 'panel', open: true })
    d = reduce(d, { type: 'open', id: 'modal', open: true })
    expect(getExpanded(d).has('panel')).toBe(true)
    expect(getExpanded(d).has('modal')).toBe(false)
    expect(getOpen(d).has('modal')).toBe(true)
    expect(getOpen(d).has('panel')).toBe(false)

    d = reduce(d, { type: 'open', id: 'modal', open: false })
    expect(getOpen(d).size).toBe(0)
    expect(getExpanded(d).has('panel')).toBe(true)
  })
})

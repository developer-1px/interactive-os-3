import { describe, expect, it } from 'vitest'
import { multiSelect } from './multiSelect'
import { fromTree } from '../state/fromTree'
import { reduce } from '../state/reduce'
import { clickTrigger, keyTrigger } from '../trigger'
import type { KeySpec } from '../key'
import type { NormalizedData } from '../types'

const key = (k: string, mods: Partial<KeySpec> = {}) => keyTrigger({ key: k, ...mods })

const list = (): NormalizedData =>
  fromTree(
    [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C', disabled: true },
      { id: 'd', label: 'D' },
      { id: 'e', label: 'E' },
    ],
    {
      getId: (n) => n.id,
      toData: (n) => ({ label: n.label, disabled: n.disabled }),
    },
  )

/** Set anchor by replaying a `select` event through `reduce`. */
const withAnchor = (d: NormalizedData, id: string) => reduce(d, { type: 'select', id })

describe('multiSelect axis — single triggers', () => {
  it('click without modifiers emits navigate + select (toggle)', () => {
    expect(multiSelect(list(), 'b', clickTrigger())).toEqual([
      { type: 'navigate', id: 'b' },
      { type: 'select', id: 'b' },
    ])
  })

  it('Space toggles current id only', () => {
    expect(multiSelect(list(), 'b', key(' '))).toEqual([{ type: 'select', id: 'b' }])
    expect(multiSelect(list(), 'b', key('Spacebar'))).toEqual([{ type: 'select', id: 'b' }])
  })

  it('Ctrl+A emits a single selectMany batch with enabled siblings', () => {
    expect(multiSelect(list(), 'a', key('a', { ctrl: true }))).toEqual([
      { type: 'selectMany', ids: ['a', 'b', 'd', 'e'], to: true },
    ])
  })

  it('Meta+A behaves the same as Ctrl+A (mac)', () => {
    expect(multiSelect(list(), 'a', key('A', { meta: true }))).toEqual([
      { type: 'selectMany', ids: ['a', 'b', 'd', 'e'], to: true },
    ])
  })

  it('plain ArrowDown without shift is ignored (falls through to navigate axis)', () => {
    expect(multiSelect(list(), 'a', key('ArrowDown'))).toBeNull()
  })

  it('non-mapped key returns null', () => {
    expect(multiSelect(list(), 'a', key('Enter'))).toBeNull()
  })
})

describe('multiSelect axis — Shift+Arrow anchor-range', () => {
  it('Shift+ArrowDown without prior anchor selects current..next', () => {
    expect(multiSelect(list(), 'a', key('ArrowDown', { shift: true }))).toEqual([
      { type: 'navigate', id: 'b' },
      { type: 'selectMany', ids: ['d', 'e'], to: false },
      { type: 'selectMany', ids: ['a', 'b'], to: true },
    ])
  })

  it('Shift+ArrowDown extends anchor range forward', () => {
    const d = withAnchor(list(), 'a')
    expect(multiSelect(d, 'b', key('ArrowDown', { shift: true }))).toEqual([
      { type: 'navigate', id: 'd' },
      { type: 'selectMany', ids: ['e'], to: false },
      { type: 'selectMany', ids: ['a', 'b', 'd'], to: true },
    ])
  })

  it('Shift+ArrowUp shrinks the range when current goes back toward anchor', () => {
    const d = withAnchor(list(), 'a')
    // anchor=a, focus=d, press Shift+ArrowUp → next=b → range [a..b]
    expect(multiSelect(d, 'd', key('ArrowUp', { shift: true }))).toEqual([
      { type: 'navigate', id: 'b' },
      { type: 'selectMany', ids: ['d', 'e'], to: false },
      { type: 'selectMany', ids: ['a', 'b'], to: true },
    ])
  })

  it('Shift+ArrowUp past anchor flips the range backward', () => {
    const d = withAnchor(list(), 'd')
    // anchor=d, focus=b, press Shift+ArrowUp → next=a → range [a..d]
    expect(multiSelect(d, 'b', key('ArrowUp', { shift: true }))).toEqual([
      { type: 'navigate', id: 'a' },
      { type: 'selectMany', ids: ['e'], to: false },
      { type: 'selectMany', ids: ['a', 'b', 'd'], to: true },
    ])
  })

  it('Shift+Arrow at the end returns null (no wrap)', () => {
    expect(multiSelect(list(), 'e', key('ArrowDown', { shift: true }))).toBeNull()
    expect(multiSelect(list(), 'a', key('ArrowUp', { shift: true }))).toBeNull()
  })

  it('disabled siblings are excluded from the range', () => {
    // c is disabled, so range [a..d] only sees [a, b, d]
    const d = withAnchor(list(), 'a')
    const out = multiSelect(d, 'b', key('ArrowDown', { shift: true }))
    expect(out).toEqual([
      { type: 'navigate', id: 'd' },
      { type: 'selectMany', ids: ['e'], to: false },
      { type: 'selectMany', ids: ['a', 'b', 'd'], to: true },
    ])
  })
})

describe('multiSelect axis — Shift+Click anchor-range', () => {
  it('Shift+Click selects anchor..clicked', () => {
    const d = withAnchor(list(), 'a')
    expect(multiSelect(d, 'd', clickTrigger({ shift: true }))).toEqual([
      { type: 'navigate', id: 'd' },
      { type: 'selectMany', ids: ['e'], to: false },
      { type: 'selectMany', ids: ['a', 'b', 'd'], to: true },
    ])
  })

  it('Shift+Click without anchor falls back to single-select on the clicked id', () => {
    expect(multiSelect(list(), 'd', clickTrigger({ shift: true }))).toEqual([
      { type: 'navigate', id: 'd' },
      { type: 'selectMany', ids: ['a', 'b', 'e'], to: false },
      { type: 'selectMany', ids: ['d'], to: true },
    ])
  })
})

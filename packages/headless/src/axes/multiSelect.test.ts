import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { KEYS } from './keys'
import { multiSelect } from './multiSelect'

const data = (anchor: string | null = null): NormalizedData => ({
  entities: { a: { id: 'a' }, b: { id: 'b' }, c: { id: 'c' }, d: { id: 'd' } },
  relationships: {},
  meta: { root: ['a', 'b', 'c', 'd'], selectAnchor: anchor },
})

const key = (k: string, mods: { shift?: boolean; ctrl?: boolean; meta?: boolean } = {}) =>
  ({ kind: 'key' as const, key: k, ...mods })

describe('multiSelect axis', () => {
  it('Space toggles current item', () => {
    expect(multiSelect(data(), 'b', key(KEYS.Space))).toEqual([{ type: 'select', id: 'b' }])
  })

  it('Ctrl+A selects all enabled siblings', () => {
    expect(multiSelect(data(), 'a', key('a', { ctrl: true }))).toEqual([
      { type: 'selectMany', ids: ['a', 'b', 'c', 'd'], to: true },
    ])
  })

  it('Shift+ArrowDown extends range from anchor', () => {
    const out = multiSelect(data('a'), 'a', key(KEYS.ArrowDown, { shift: true }))
    expect(out).toEqual([
      { type: 'navigate', id: 'b' },
      { type: 'selectMany', ids: ['c', 'd'], to: false },
      { type: 'selectMany', ids: ['a', 'b'], to: true },
    ])
  })

  it('Shift+ArrowUp at start returns null', () => {
    expect(multiSelect(data('a'), 'a', key(KEYS.ArrowUp, { shift: true }))).toBeNull()
  })

  it('plain click navigates + selects', () => {
    expect(multiSelect(data(), 'b', { kind: 'click' })).toEqual([
      { type: 'navigate', id: 'b' },
      { type: 'select', id: 'b' },
    ])
  })

  it('Shift+click extends range from anchor', () => {
    const out = multiSelect(data('a'), 'a', { kind: 'click', shift: true })
    expect(out![0]).toEqual({ type: 'navigate', id: 'a' })
  })
})

import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { KEYS } from './keys'
import { multiSelect } from './multiSelect'

const data = (anchor: string | null = null): NormalizedData => ({
  entities: { a: { id: 'a' }, b: { id: 'b' }, c: { id: 'c' }, d: { id: 'd' } },
  relationships: {},
  meta: { root: ['a', 'b', 'c', 'd'], selectAnchor: anchor },
})

const key = (k: string, mods: { shift?: boolean; ctrl?: boolean; meta?: boolean } = {}): string => {
  const parts: string[] = []
  if (mods.ctrl)  parts.push('Control')
  if (mods.meta)  parts.push('Meta')
  if (mods.shift) parts.push('Shift')
  parts.push(k === ' ' ? 'Space' : k)
  return parts.join('+')
}
const click = (mods: { shift?: boolean; ctrl?: boolean; meta?: boolean; alt?: boolean } = {}): string => {
  const parts: string[] = []
  if (mods.ctrl)  parts.push('Control')
  if (mods.alt)   parts.push('Alt')
  if (mods.meta)  parts.push('Meta')
  if (mods.shift) parts.push('Shift')
  parts.push('Click')
  return parts.join('+')
}

describe('multiSelect axis', () => {
  it('Space toggles current item via setAnchor + selectMany (currently false → true)', () => {
    const d: NormalizedData = {
      entities: { a: { id: 'a' }, b: { id: 'b', selected: false } },
      relationships: {},
      meta: { root: ['a', 'b'] },
    }
    expect(multiSelect(d, 'b', key(KEYS.Space))).toEqual([
      { type: 'setAnchor', id: 'b' },
      { type: 'selectMany', ids: ['b'], to: true },
    ])
  })

  it('Space toggles current item via setAnchor + selectMany (currently true → false)', () => {
    const d: NormalizedData = {
      entities: { a: { id: 'a' }, b: { id: 'b', selected: true } },
      relationships: {},
      meta: { root: ['a', 'b'] },
    }
    expect(multiSelect(d, 'b', key(KEYS.Space))).toEqual([
      { type: 'setAnchor', id: 'b' },
      { type: 'selectMany', ids: ['b'], to: false },
    ])
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
    expect(multiSelect(data(), 'b', click())).toEqual([
      { type: 'navigate', id: 'b' },
      { type: 'select', id: 'b' },
    ])
  })

  it('Shift+click extends range from anchor', () => {
    const out = multiSelect(data('a'), 'a', click({ shift: true }))
    expect(out![0]).toEqual({ type: 'navigate', id: 'a' })
  })

  it('Cmd+click toggles add/remove (currently false → true)', () => {
    const d: NormalizedData = {
      entities: { a: { id: 'a', selected: false }, b: { id: 'b' } },
      relationships: {},
      meta: { root: ['a', 'b'] },
    }
    expect(multiSelect(d, 'a', click({ meta: true }))).toEqual([
      { type: 'navigate', id: 'a' },
      { type: 'setAnchor', id: 'a' },
      { type: 'selectMany', ids: ['a'], to: true },
    ])
  })

  it('Cmd+click toggles add/remove (currently true → false)', () => {
    const d: NormalizedData = {
      entities: { a: { id: 'a', selected: true }, b: { id: 'b' } },
      relationships: {},
      meta: { root: ['a', 'b'] },
    }
    expect(multiSelect(d, 'a', click({ meta: true }))).toEqual([
      { type: 'navigate', id: 'a' },
      { type: 'setAnchor', id: 'a' },
      { type: 'selectMany', ids: ['a'], to: false },
    ])
  })

  it('Ctrl+click works same as Cmd+click on non-mac', () => {
    const d: NormalizedData = {
      entities: { a: { id: 'a', selected: false }, b: { id: 'b' } },
      relationships: {},
      meta: { root: ['a', 'b'] },
    }
    expect(multiSelect(d, 'a', click({ ctrl: true }))).toEqual([
      { type: 'navigate', id: 'a' },
      { type: 'setAnchor', id: 'a' },
      { type: 'selectMany', ids: ['a'], to: true },
    ])
  })
})

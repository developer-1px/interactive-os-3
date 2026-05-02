import { describe, expect, it } from 'vitest'
import { multiSelect } from './multiSelect'
import { fromTree } from '../state/fromTree'
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
    ],
    {
      getId: (n) => n.id,
      toData: (n) => ({ label: n.label, disabled: n.disabled }),
    },
  )

describe('multiSelect axis', () => {
  it('click emits navigate + select for the clicked id', () => {
    expect(multiSelect(list(), 'b', clickTrigger)).toEqual([
      { type: 'navigate', id: 'b' },
      { type: 'select', id: 'b' },
    ])
  })

  it('Space toggles current id only', () => {
    expect(multiSelect(list(), 'b', key(' '))).toEqual([{ type: 'select', id: 'b' }])
    expect(multiSelect(list(), 'b', key('Spacebar'))).toEqual([{ type: 'select', id: 'b' }])
  })

  it('Ctrl+A emits select for every enabled sibling', () => {
    const out = multiSelect(list(), 'a', key('a', { ctrl: true }))
    expect(out).toEqual([
      { type: 'select', id: 'a' },
      { type: 'select', id: 'b' },
      { type: 'select', id: 'd' },
    ])
  })

  it('Meta+A behaves the same as Ctrl+A (mac)', () => {
    const out = multiSelect(list(), 'a', key('A', { meta: true }))
    expect(out?.map((e) => e.type)).toEqual(['select', 'select', 'select'])
  })

  it('Shift+ArrowDown moves focus and selects the next enabled sibling', () => {
    expect(multiSelect(list(), 'a', key('ArrowDown', { shift: true }))).toEqual([
      { type: 'navigate', id: 'b' },
      { type: 'select', id: 'b' },
    ])
  })

  it('Shift+ArrowUp moves focus and selects the previous sibling', () => {
    expect(multiSelect(list(), 'b', key('ArrowUp', { shift: true }))).toEqual([
      { type: 'navigate', id: 'a' },
      { type: 'select', id: 'a' },
    ])
  })

  it('Shift+Arrow at the end returns null (no wrap)', () => {
    expect(multiSelect(list(), 'd', key('ArrowDown', { shift: true }))).toBeNull()
    expect(multiSelect(list(), 'a', key('ArrowUp', { shift: true }))).toBeNull()
  })

  it('plain ArrowDown without shift is ignored (falls through to navigate axis)', () => {
    expect(multiSelect(list(), 'a', key('ArrowDown'))).toBeNull()
  })

  it('non-key, non-click triggers ignored', () => {
    expect(multiSelect(list(), 'a', key('Enter'))).toBeNull()
  })
})

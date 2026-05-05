import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { KEYS } from './keys'
import { navigate } from './navigate'
import { pageNavigate } from './pageNavigate'

const data: NormalizedData = {
  entities: { a: { id: 'a' }, b: { id: 'b' }, c: { id: 'c' }, d: { id: 'd' } },
  relationships: {},
  meta: { root: ['a', 'b', 'c', 'd'] },
}

const key = (k: string) => k

describe('navigate axis (vertical)', () => {
  const ax = navigate('vertical')

  it('emits dir:next on ArrowDown', () => {
    expect(ax(data, 'a', key(KEYS.ArrowDown))).toEqual([{ type: 'navigate', id: 'a', dir: 'next' }])
  })

  it('emits dir:prev on ArrowUp', () => {
    expect(ax(data, 'b', key(KEYS.ArrowUp))).toEqual([{ type: 'navigate', id: 'b', dir: 'prev' }])
  })

  it('emits dir:start on Home', () => {
    expect(ax(data, 'c', key(KEYS.Home))).toEqual([{ type: 'navigate', id: 'c', dir: 'start' }])
  })

  it('emits dir:end on End', () => {
    expect(ax(data, 'a', key(KEYS.End))).toEqual([{ type: 'navigate', id: 'a', dir: 'end' }])
  })

  it('returns null on non-matching key', () => {
    expect(ax(data, 'a', key(KEYS.Enter))).toBeNull()
  })
})

describe('navigate axis (horizontal)', () => {
  const ax = navigate('horizontal')

  it('uses ArrowLeft/ArrowRight for prev/next', () => {
    expect(ax(data, 'a', key(KEYS.ArrowRight))).toEqual([{ type: 'navigate', id: 'a', dir: 'next' }])
    expect(ax(data, 'b', key(KEYS.ArrowLeft))).toEqual([{ type: 'navigate', id: 'b', dir: 'prev' }])
  })

  it('does not respond to ArrowDown/ArrowUp', () => {
    expect(ax(data, 'a', key(KEYS.ArrowDown))).toBeNull()
  })
})

describe('pageNavigate axis', () => {
  it('PageDown moves N siblings forward, clamped at end', () => {
    const ax = pageNavigate('vertical', 2)
    expect(ax(data, 'a', key(KEYS.PageDown))).toEqual([{ type: 'navigate', id: 'c' }])
    expect(ax(data, 'c', key(KEYS.PageDown))).toEqual([{ type: 'navigate', id: 'd' }])
  })

  it('PageUp moves N siblings backward, clamped at start', () => {
    const ax = pageNavigate('vertical', 2)
    expect(ax(data, 'd', key(KEYS.PageUp))).toEqual([{ type: 'navigate', id: 'b' }])
    expect(ax(data, 'b', key(KEYS.PageUp))).toEqual([{ type: 'navigate', id: 'a' }])
  })

  it('returns null when target equals current (no movement)', () => {
    const ax = pageNavigate('vertical', 1)
    expect(ax(data, 'd', key(KEYS.PageDown))).toBeNull()
  })
})

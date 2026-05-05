import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { KEYS } from './keys'
import { numericStep } from './numericStep'

const data: NormalizedData = {
  entities: {
    s: { id: 's', value: 50, min: 0, max: 100, step: 5 },
    edge: { id: 'edge', value: 100, min: 0, max: 100, step: 5 },
  },
  relationships: {},
  meta: {},
}

const key = (k: string) => ({ kind: 'key' as const, key: k })

describe('numericStep axis (horizontal)', () => {
  const ax = numericStep('horizontal')

  it('ArrowRight increments by step', () => {
    expect(ax(data, 's', key(KEYS.ArrowRight))).toEqual([{ type: 'value', id: 's', value: 55 }])
  })

  it('ArrowLeft decrements by step', () => {
    expect(ax(data, 's', key(KEYS.ArrowLeft))).toEqual([{ type: 'value', id: 's', value: 45 }])
  })

  it('Home jumps to min', () => {
    expect(ax(data, 's', key(KEYS.Home))).toEqual([{ type: 'value', id: 's', value: 0 }])
  })

  it('End jumps to max', () => {
    expect(ax(data, 's', key(KEYS.End))).toEqual([{ type: 'value', id: 's', value: 100 }])
  })

  it('PageUp increments by step*10, clamped to max', () => {
    expect(ax(data, 's', key(KEYS.PageUp))).toEqual([{ type: 'value', id: 's', value: 100 }])
  })

  it('PageDown decrements by step*10, clamped to min', () => {
    expect(ax(data, 's', key(KEYS.PageDown))).toEqual([{ type: 'value', id: 's', value: 0 }])
  })

  it('returns null when at max and incrementing further', () => {
    expect(ax(data, 'edge', key(KEYS.ArrowRight))).toBeNull()
  })

  it('returns null on non-matching key', () => {
    expect(ax(data, 's', key(KEYS.Enter))).toBeNull()
  })
})

describe('numericStep axis (vertical)', () => {
  const ax = numericStep('vertical')

  it('ArrowUp increments, ArrowDown decrements', () => {
    expect(ax(data, 's', key(KEYS.ArrowUp))).toEqual([{ type: 'value', id: 's', value: 55 }])
    expect(ax(data, 's', key(KEYS.ArrowDown))).toEqual([{ type: 'value', id: 's', value: 45 }])
  })
})

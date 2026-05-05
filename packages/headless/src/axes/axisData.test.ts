/**
 * AxisData / runAxis — phase 2 (PRD #38).
 * 데이터-형 axis 와 runner 의 행동 검증. Trigger = string (phase 2.5a).
 */
import { describe, expect, it } from 'vitest'
import type { AxisData } from './axisData'
import { runAxis, axisChords, axisKeys, composeAxisData } from './axisData'

describe('runAxis', () => {
  const escapeAxis: AxisData = [
    ['Escape', { type: 'open', open: false }],
  ]

  it('matches single chord, injects focusId', () => {
    expect(runAxis(escapeAxis, 'foo', 'Escape'))
      .toEqual([{ type: 'open', id: 'foo', open: false }])
  })

  it('returns null when no match', () => {
    expect(runAxis(escapeAxis, 'foo', 'a')).toBeNull()
  })

  it('returns null on click trigger', () => {
    expect(runAxis(escapeAxis, 'foo', 'Click')).toBeNull()
  })

  it('chord union — any of array matches', () => {
    const axis: AxisData = [
      [['Enter', 'Space'], { type: 'activate' }],
    ]
    expect(runAxis(axis, 'x', 'Enter')).toEqual([{ type: 'activate', id: 'x' }])
    expect(runAxis(axis, 'x', 'Space')).toEqual([{ type: 'activate', id: 'x' }])
  })

  it('priority order — first match wins', () => {
    const axis: AxisData = [
      ['ArrowDown', { type: 'navigate', dir: 'next' } as never],
      ['ArrowDown', { type: 'activate' }],
    ]
    expect(runAxis(axis, 'x', 'ArrowDown')?.[0].type).toBe('navigate')
  })

  it('preserves explicit id in template', () => {
    const axis: AxisData = [
      ['Escape', { type: 'open', id: 'explicit', open: false }],
    ]
    expect(runAxis(axis, 'focus', 'Escape'))
      .toEqual([{ type: 'open', id: 'explicit', open: false }])
  })

  it('modifier match — Shift+Tab', () => {
    const axis: AxisData = [['Shift+Tab', { type: 'activate' }]]
    expect(runAxis(axis, 'x', 'Shift+Tab')).not.toBeNull()
    expect(runAxis(axis, 'x', 'Tab')).toBeNull()
  })

  it('Click trigger matches Click chord', () => {
    const axis: AxisData = [['Click', { type: 'activate' }]]
    expect(runAxis(axis, 'x', 'Click')).toEqual([{ type: 'activate', id: 'x' }])
    expect(runAxis(axis, 'x', 'Shift+Click')).toBeNull()
  })

  it('Shift+Click matches Shift+Click chord', () => {
    const axis: AxisData = [['Shift+Click', { type: 'activate' }]]
    expect(runAxis(axis, 'x', 'Shift+Click')).not.toBeNull()
    expect(runAxis(axis, 'x', 'Click')).toBeNull()
  })
})

describe('axisChords / axisKeys', () => {
  const axis: AxisData = [
    [['Enter', 'Space'], { type: 'activate' }],
    ['Escape', { type: 'open', open: false }],
    ['Enter', { type: 'activate' }],
  ]

  it('axisChords — flatten + dedup', () => {
    expect(axisChords(axis)).toEqual(['Enter', 'Space', 'Escape'])
  })

  it('axisKeys — key part only, dedup', () => {
    expect(axisKeys(axis)).toEqual(['Enter', ' ', 'Escape'])
  })
})

describe('composeAxisData', () => {
  it('concats in priority order', () => {
    const a: AxisData = [['Escape', { type: 'open', open: false }]]
    const b: AxisData = [['Enter', { type: 'activate' }]]
    const c = composeAxisData(a, b)
    expect(c.length).toBe(2)
    expect(axisChords(c)).toEqual(['Escape', 'Enter'])
  })
})

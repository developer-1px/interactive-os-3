import { describe, expect, it, vi } from 'vitest'
import { spinbuttonPattern } from './spinbutton'
import { fromTree } from '../state/fromTree'
import type { NormalizedData } from '../types'

const make = (overrides: Record<string, unknown> = {}): NormalizedData =>
  fromTree([{ id: 'n', value: 5, min: 0, max: 10, step: 1, label: 'Quantity', ...overrides }])

describe('spinbuttonPattern', () => {
  it('exposes role=spinbutton + aria-value* + aria-label', () => {
    const { spinbuttonProps } = spinbuttonPattern(make(), 'n')
    expect(spinbuttonProps.role).toBe('spinbutton')
    expect(spinbuttonProps['aria-valuenow' as keyof typeof spinbuttonProps]).toBe(5)
    expect(spinbuttonProps['aria-valuemin' as keyof typeof spinbuttonProps]).toBe(0)
    expect(spinbuttonProps['aria-valuemax' as keyof typeof spinbuttonProps]).toBe(10)
    expect(spinbuttonProps['aria-label' as keyof typeof spinbuttonProps]).toBe('Quantity')
    expect(spinbuttonProps.tabIndex).toBe(0)
  })

  it('omits aria-valuemin/max when not in entity', () => {
    const data = fromTree([{ id: 'n', value: 5 }])
    const { spinbuttonProps } = spinbuttonPattern(data, 'n')
    expect(spinbuttonProps['aria-valuemin' as keyof typeof spinbuttonProps]).toBeUndefined()
    expect(spinbuttonProps['aria-valuemax' as keyof typeof spinbuttonProps]).toBeUndefined()
  })

  it('passes opts.invalid → aria-invalid, opts.readOnly → aria-readonly, opts.valueText → aria-valuetext', () => {
    const { spinbuttonProps } = spinbuttonPattern(make(), 'n', undefined, {
      invalid: true,
      readOnly: true,
      valueText: 'five units',
    })
    expect(spinbuttonProps['aria-invalid' as keyof typeof spinbuttonProps]).toBe(true)
    expect(spinbuttonProps['aria-readonly' as keyof typeof spinbuttonProps]).toBe(true)
    expect(spinbuttonProps['aria-valuetext' as keyof typeof spinbuttonProps]).toBe('five units')
  })

  // bindAxis 가 events.forEach(onEvent) — forEach 가 (item, idx, arr) 전달이므로 첫 인수만 검사
  const lastEvent = (mock: ReturnType<typeof vi.fn>) => mock.mock.calls.at(-1)?.[0]
  const fakeEvent = (key: string) => ({
    key, ctrlKey: false, altKey: false, metaKey: false, shiftKey: false,
    preventDefault: () => {},
  })

  it('ArrowUp emits {value: 6}, ArrowDown emits {value: 4}', () => {
    const onEvent = vi.fn()
    const { spinbuttonProps } = spinbuttonPattern(make(), 'n', onEvent)
    const handler = spinbuttonProps.onKeyDown as (e: unknown) => void
    handler(fakeEvent('ArrowUp'))
    expect(lastEvent(onEvent)).toEqual({ type: 'value', id: 'n', value: 6 })
    handler(fakeEvent('ArrowDown'))
    expect(lastEvent(onEvent)).toEqual({ type: 'value', id: 'n', value: 4 })
  })

  it('PageUp emits +step*10 (clamped to max), PageDown -step*10 (clamped to min)', () => {
    const onEvent = vi.fn()
    const { spinbuttonProps } = spinbuttonPattern(make(), 'n', onEvent)
    const handler = spinbuttonProps.onKeyDown as (e: unknown) => void
    handler(fakeEvent('PageUp'))
    expect(lastEvent(onEvent)).toEqual({ type: 'value', id: 'n', value: 10 })
    handler(fakeEvent('PageDown'))
    expect(lastEvent(onEvent)).toEqual({ type: 'value', id: 'n', value: 0 })
  })

  it('Home/End jump to min/max', () => {
    const onEvent = vi.fn()
    const { spinbuttonProps } = spinbuttonPattern(make(), 'n', onEvent)
    const handler = spinbuttonProps.onKeyDown as (e: unknown) => void
    handler(fakeEvent('Home'))
    expect(lastEvent(onEvent)).toEqual({ type: 'value', id: 'n', value: 0 })
    handler(fakeEvent('End'))
    expect(lastEvent(onEvent)).toEqual({ type: 'value', id: 'n', value: 10 })
  })
})

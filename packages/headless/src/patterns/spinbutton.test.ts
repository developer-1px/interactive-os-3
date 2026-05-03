import { describe, expect, it, vi } from 'vitest'
import { spinbuttonPattern, type SpinbuttonOptions } from './spinbutton'

const baseOpts: SpinbuttonOptions = { min: 0, max: 10, step: 1, label: 'Quantity' }

describe('spinbuttonPattern', () => {
  it('exposes role=spinbutton + aria-value* + aria-label', () => {
    const { spinbuttonProps } = spinbuttonPattern(5, undefined, baseOpts)
    expect(spinbuttonProps.role).toBe('spinbutton')
    expect(spinbuttonProps['aria-valuenow' as keyof typeof spinbuttonProps]).toBe(5)
    expect(spinbuttonProps['aria-valuemin' as keyof typeof spinbuttonProps]).toBe(0)
    expect(spinbuttonProps['aria-valuemax' as keyof typeof spinbuttonProps]).toBe(10)
    expect(spinbuttonProps['aria-label' as keyof typeof spinbuttonProps]).toBe('Quantity')
    expect(spinbuttonProps.tabIndex).toBe(0)
  })

  it('omits aria-valuemin/max when not provided', () => {
    const { spinbuttonProps } = spinbuttonPattern(5)
    expect(spinbuttonProps['aria-valuemin' as keyof typeof spinbuttonProps]).toBeUndefined()
    expect(spinbuttonProps['aria-valuemax' as keyof typeof spinbuttonProps]).toBeUndefined()
  })

  it('passes opts.invalid → aria-invalid, opts.readOnly → aria-readonly, opts.valueText → aria-valuetext', () => {
    const { spinbuttonProps } = spinbuttonPattern(5, undefined, {
      ...baseOpts,
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
    const dispatch = vi.fn()
    const { spinbuttonProps } = spinbuttonPattern(5, dispatch, baseOpts)
    const handler = spinbuttonProps.onKeyDown as (e: unknown) => void
    handler(fakeEvent('ArrowUp'))
    expect(lastEvent(dispatch)).toEqual({ type: 'value', value: 6 })
    handler(fakeEvent('ArrowDown'))
    expect(lastEvent(dispatch)).toEqual({ type: 'value', value: 4 })
  })

  it('PageUp emits +step*10 (clamped to max), PageDown -step*10 (clamped to min)', () => {
    const dispatch = vi.fn()
    const { spinbuttonProps } = spinbuttonPattern(5, dispatch, baseOpts)
    const handler = spinbuttonProps.onKeyDown as (e: unknown) => void
    handler(fakeEvent('PageUp'))
    expect(lastEvent(dispatch)).toEqual({ type: 'value', value: 10 })
    handler(fakeEvent('PageDown'))
    expect(lastEvent(dispatch)).toEqual({ type: 'value', value: 0 })
  })

  it('Home/End jump to min/max', () => {
    const dispatch = vi.fn()
    const { spinbuttonProps } = spinbuttonPattern(5, dispatch, baseOpts)
    const handler = spinbuttonProps.onKeyDown as (e: unknown) => void
    handler(fakeEvent('Home'))
    expect(lastEvent(dispatch)).toEqual({ type: 'value', value: 0 })
    handler(fakeEvent('End'))
    expect(lastEvent(dispatch)).toEqual({ type: 'value', value: 10 })
  })
})

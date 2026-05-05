import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { useRadioGroupPattern } from './radioGroup'
import { reduceWithRadio } from '../state/defaults'
import { fromList } from '../state/fromTree'

afterEach(() => cleanup())

describe('useRadioGroupPattern + reduceWithRadio', () => {
  it('reads entity.checked → aria-checked', () => {
    let data = fromList([{ id: 'a' }, { id: 'b' }])
    data = reduceWithRadio(data, { type: 'check', id: 'a' })
    function H() {
      const { radioProps } = useRadioGroupPattern(data, () => {})
      return <span {...(radioProps('a') as unknown as Record<string, unknown>)} data-testid="a" />
    }
    const { getByTestId } = render(<H />)
    expect(getByTestId('a').getAttribute('aria-checked')).toBe('true')
  })

  it('check on a clears check on b (single-of-group)', () => {
    let data = fromList([{ id: 'a' }, { id: 'b' }])
    data = reduceWithRadio(data, { type: 'check', id: 'a' })
    expect(data.entities.a?.checked).toBe(true)
    data = reduceWithRadio(data, { type: 'check', id: 'b' })
    expect(data.entities.a?.checked).toBe(false)
    expect(data.entities.b?.checked).toBe(true)
  })
})

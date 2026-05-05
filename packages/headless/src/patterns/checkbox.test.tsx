import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { checkboxPattern, checkboxKeys, useCheckboxGroupPattern } from './checkbox'
import { fromList } from '../state/fromTree'

afterEach(() => cleanup())

function CheckboxHarness({ onToggle }: { onToggle: (v: boolean | 'mixed') => void }) {
  const { checkboxProps } = checkboxPattern(false, (e) => onToggle(e.value))
  return <button {...(checkboxProps as unknown as Record<string, unknown>)}>x</button>
}

describe('checkboxPattern', () => {
  it('Space toggles via dispatch', () => {
    const onToggle = vi.fn()
    const { getByRole } = render(<CheckboxHarness onToggle={onToggle} />)
    const btn = getByRole('checkbox')

    fireEvent.keyDown(btn, { key: ' ' })

    expect(onToggle).toHaveBeenCalledWith(true)
  })
})

describe('useCheckboxGroupPattern', () => {
  it('Space on parent toggles via selectMany', () => {
    const data = fromList([{ id: 'a' }, { id: 'b' }])
    const onEvent = vi.fn()
    function H() {
      const { parentProps } = useCheckboxGroupPattern(data, onEvent)
      return <button {...(parentProps as unknown as Record<string, unknown>)}>p</button>
    }
    const { getByText } = render(<H />)
    fireEvent.keyDown(getByText('p'), { key: ' ' })
    expect(onEvent).toHaveBeenCalledWith(expect.objectContaining({ type: 'selectMany' }))
  })
})

describe('checkboxKeys (SSOT)', () => {
  it('returns ["Space"] from declarative chord registry', () => {
    expect(checkboxKeys()).toEqual([' '])
  })
})

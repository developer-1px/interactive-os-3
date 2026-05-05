import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { checkboxPattern, checkboxKeys, useCheckboxGroupPattern } from './checkbox'
import { fromList } from '../state/fromTree'
import type { NormalizedData } from '../types'

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

describe('useCheckboxGroupPattern child toggle (#24)', () => {
  it('child click emits selectMany with toggled to', () => {
    const data = fromList([{ id: 'a' }, { id: 'b' }])
    const onEvent = vi.fn()
    function H() {
      const { childProps } = useCheckboxGroupPattern(data, onEvent)
      return <button {...(childProps('a') as unknown as Record<string, unknown>)}>a</button>
    }
    const { getByText } = render(<H />)
    fireEvent.click(getByText('a'))
    expect(onEvent).toHaveBeenCalledWith({ type: 'selectMany', ids: ['a'], to: true })
  })

  it('child Space emits selectMany', () => {
    const data = fromList([{ id: 'a' }])
    const onEvent = vi.fn()
    function H() {
      const { childProps } = useCheckboxGroupPattern(data, onEvent)
      return <button {...(childProps('a') as unknown as Record<string, unknown>)}>a</button>
    }
    const { getByText } = render(<H />)
    fireEvent.keyDown(getByText('a'), { key: ' ' })
    expect(onEvent).toHaveBeenCalledWith({ type: 'selectMany', ids: ['a'], to: true })
  })

  it('child click on already-selected toggles to false', () => {
    const data: NormalizedData = {
      entities: { a: { id: 'a', selected: true } },
      relationships: { ROOT: ['a'] },
      meta: { root: ['a'] },
    }
    const onEvent = vi.fn()
    function H() {
      const { childProps } = useCheckboxGroupPattern(data, onEvent)
      return <button {...(childProps('a') as unknown as Record<string, unknown>)}>a</button>
    }
    const { getByText } = render(<H />)
    fireEvent.click(getByText('a'))
    expect(onEvent).toHaveBeenCalledWith({ type: 'selectMany', ids: ['a'], to: false })
  })
})

describe('checkboxKeys (SSOT)', () => {
  it('returns ["Space"] from declarative chord registry', () => {
    expect(checkboxKeys()).toEqual([' '])
  })
})

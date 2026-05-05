/**
 * useFocusTrap — Tab/Shift+Tab DOM focus 경계 관리 primitive.
 *
 * dialog/popover modal 등에서 재사용. data 비의존 — rootRef + enabled 만 받음.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, fireEvent } from '@testing-library/react'

afterEach(() => cleanup())
import { useRef } from 'react'
import { useFocusTrap, focusTrapKeys } from './focusTrap'

function Harness({ enabled }: { enabled: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  useFocusTrap(rootRef, enabled)
  return (
    <div ref={rootRef} data-testid="root">
      <button>first</button>
      <button>middle</button>
      <button>last</button>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('Tab at last focusable cycles to first', () => {
    const { getByText } = render(<Harness enabled={true} />)
    const last = getByText('last') as HTMLButtonElement
    const first = getByText('first') as HTMLButtonElement
    last.focus()
    expect(document.activeElement).toBe(last)

    fireEvent.keyDown(document, { key: 'Tab' })

    expect(document.activeElement).toBe(first)
  })

  it('Shift+Tab at first focusable cycles to last', () => {
    const { getByText } = render(<Harness enabled={true} />)
    const first = getByText('first') as HTMLButtonElement
    const last = getByText('last') as HTMLButtonElement
    first.focus()

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(last)
  })

  it('disabled: Tab at last does not cycle', () => {
    const { getByText } = render(<Harness enabled={false} />)
    const last = getByText('last') as HTMLButtonElement
    last.focus()

    fireEvent.keyDown(document, { key: 'Tab' })

    expect(document.activeElement).toBe(last)
  })

  it('focusTrapKeys exports declarative key list for probe', () => {
    expect(focusTrapKeys()).toEqual(['Tab'])
  })
})

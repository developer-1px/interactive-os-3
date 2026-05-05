import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { useDialogPattern, dialogKeys } from './dialog'
import type { ReactElement } from 'react'

afterEach(() => cleanup())

function DialogHarness({ children, modal = true }: { children?: ReactElement; modal?: boolean }) {
  const d = useDialogPattern({ defaultOpen: true, modal })
  return (
    <div {...(d.rootProps as unknown as Record<string, unknown>)}>
      {children ?? <button>only</button>}
    </div>
  )
}

describe('useDialogPattern', () => {
  it('Escape closes the dialog', () => {
    const { getByRole } = render(<DialogHarness />)
    const root = getByRole('dialog')
    expect(root.hidden).toBe(false)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(root.hidden).toBe(true)
  })

  it('open: focus moves into first focusable', () => {
    const { getByText } = render(<DialogHarness />)
    expect(document.activeElement).toBe(getByText('only'))
  })
})

describe('dialogKeys (SSOT — derived from probe + focusTrap)', () => {
  it('modal=true: includes Escape and Tab', () => {
    const keys = dialogKeys({ modal: true })
    expect(keys).toContain('Escape')
    expect(keys).toContain('Tab')
  })

  it('modal=false: includes Escape but not Tab', () => {
    const keys = dialogKeys({ modal: false })
    expect(keys).toContain('Escape')
    expect(keys).not.toContain('Tab')
  })
})

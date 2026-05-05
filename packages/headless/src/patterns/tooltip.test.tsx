import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { useTooltipPattern, tooltipKeys } from './tooltip'

afterEach(() => cleanup())

function Harness() {
  const { triggerProps, tipProps } = useTooltipPattern({ delayShow: 0, delayHide: 0, idPrefix: 't' })
  return (
    <>
      <button {...(triggerProps as Record<string, unknown>)}>trigger</button>
      <span {...(tipProps as unknown as Record<string, unknown>)}>tip</span>
    </>
  )
}

describe('useTooltipPattern', () => {
  it('Escape closes the tooltip', async () => {
    const { getByText } = render(<Harness />)
    const trigger = getByText('trigger')
    const tip = getByText('tip')
    await act(async () => {
      fireEvent.focus(trigger)
      await new Promise((r) => setTimeout(r, 5))
    })
    expect(tip.hidden).toBe(false)

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })

    expect(tip.hidden).toBe(true)
  })
})

describe('tooltipKeys (SSOT — derived from escape axis)', () => {
  it('returns [Escape] from escapeKeys()', () => {
    expect(tooltipKeys()).toEqual(['Escape'])
  })
})

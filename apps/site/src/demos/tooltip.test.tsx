import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './tooltip'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.useRealTimers()
  cleanup()
})

const trigger = () => screen.getByRole('button') as HTMLButtonElement
const tip = () => screen.queryByRole('tooltip', { hidden: true }) as HTMLElement | null

const flushShow = () => act(() => { vi.advanceTimersByTime(450) })
const flushHide = () => act(() => { vi.advanceTimersByTime(150) })

describe('tooltip demo — black-box (keyboard + mouse)', () => {
  it('초기 — tooltip 숨김', () => {
    render(<Demo />)
    expect(tip()).toBeNull()
  })

  it('mouseEnter + show delay 후 tooltip 노출', () => {
    render(<Demo />)
    fireEvent.mouseEnter(trigger())
    flushShow()
    expect(tip()).not.toBeNull()
  })

  it('mouseLeave + hide delay 후 tooltip 숨김', () => {
    render(<Demo />)
    fireEvent.mouseEnter(trigger())
    flushShow()
    fireEvent.mouseLeave(trigger())
    flushHide()
    expect(tip()).toBeNull()
  })

  it('focus 시 tooltip 노출 (delay 후)', () => {
    render(<Demo />)
    fireEvent.focus(trigger())
    flushShow()
    expect(tip()).not.toBeNull()
  })

  it('blur 시 tooltip 숨김', () => {
    render(<Demo />)
    fireEvent.focus(trigger())
    flushShow()
    fireEvent.blur(trigger())
    flushHide()
    expect(tip()).toBeNull()
  })

  it('aria-describedby 가 tip id 와 매칭', () => {
    render(<Demo />)
    fireEvent.focus(trigger())
    flushShow()
    const id = trigger().getAttribute('aria-describedby')!
    expect(document.getElementById(id)).toBe(tip())
  })

  it('Escape (window-level) 로 tooltip 닫힘', () => {
    render(<Demo />)
    fireEvent.focus(trigger())
    flushShow()
    expect(tip()).not.toBeNull()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(tip()).toBeNull()
  })

  it('meta.keys 의 모든 키가 tooltip 을 닫는다 (window-level)', () => {
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      fireEvent.focus(trigger())
      flushShow()
      const before = tip() !== null
      fireEvent.keyDown(window, { key })
      const after = tip() !== null
      expect({ key, changed: before !== after }).toEqual({ key, changed: true })
    }
  })
})

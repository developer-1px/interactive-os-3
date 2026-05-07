import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './tabs'

afterEach(cleanup)

const tablist = () => screen.getByRole('tablist') as HTMLElement
const tabs = () => screen.getAllByRole('tab') as HTMLElement[]
const focused = () => tabs().find((t) => t.tabIndex === 0)!
const selected = () => tabs().filter((t) => t.getAttribute('aria-selected') === 'true')
const visiblePanel = () =>
  screen.getAllByRole('tabpanel', { hidden: true }).find((p) => !p.hasAttribute('hidden'))!

describe('tabs demo — black-box (keyboard + mouse)', () => {
  it('초기 — Overview selected, 3개 tab', () => {
    render(<Demo />)
    expect(tabs().length).toBe(3)
    expect(selected().length).toBe(1)
    expect(selected()[0].textContent).toBe('Overview')
  })

  it('tablist role + 3개 tab', () => {
    render(<Demo />)
    expect(tablist().getAttribute('role')).toBe('tablist')
  })

  it('각 tab 의 aria-controls 가 panel id 와 매칭', () => {
    render(<Demo />)
    for (const t of tabs()) {
      const id = t.getAttribute('aria-controls')!
      expect(document.getElementById(id)).not.toBeNull()
    }
  })

  it('마우스 클릭으로 다른 tab 이 selected 된다', () => {
    render(<Demo />)
    fireEvent.click(tabs()[1])
    expect(selected()[0].textContent).toBe('Behavior')
  })

  it('selected tab 의 panel 만 visible', () => {
    render(<Demo />)
    expect(visiblePanel().textContent).toContain('Overview')
    fireEvent.click(tabs()[2])
    expect(visiblePanel().textContent).toContain('Patterns')
  })

  it('ArrowRight 으로 다음 tab 이 selected (selection-follows-focus)', () => {
    render(<Demo />)
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    expect(selected()[0].textContent).toBe('Behavior')
  })

  it('ArrowLeft 으로 이전 tab', () => {
    render(<Demo />)
    fireEvent.click(tabs()[2])
    fireEvent.keyDown(focused(), { key: 'ArrowLeft' })
    expect(selected()[0].textContent).toBe('Behavior')
  })

  it('Home/End 로 첫/마지막 tab', () => {
    render(<Demo />)
    fireEvent.keyDown(focused(), { key: 'End' })
    expect(selected()[0].textContent).toBe('Patterns')
    fireEvent.keyDown(focused(), { key: 'Home' })
    expect(selected()[0].textContent).toBe('Overview')
  })

  it('meta.keys 의 모든 키가 black-box 동작', () => {
    const snap = () => ({
      sel: tabs().map((t) => t.getAttribute('aria-selected')).join(','),
      focusLabel: focused()?.textContent ?? '',
    })
    const startsFromLast = ['Home', 'ArrowLeft', 'ArrowUp', 'PageUp']
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      if (startsFromLast.includes(key)) fireEvent.keyDown(focused(), { key: 'End' })
      const before = snap()
      if (key === 'Click') fireEvent.click(tabs()[2])
      else fireEvent.keyDown(focused(), { key })
      const after = snap()
      const changed = before.sel !== after.sel || before.focusLabel !== after.focusLabel
      expect({ key, changed }).toEqual({ key, changed: true })
    }
  })
})

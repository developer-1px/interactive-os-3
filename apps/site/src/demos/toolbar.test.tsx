import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './toolbar'

afterEach(cleanup)

const toolbar = () => screen.getByRole('toolbar') as HTMLElement
const items = () => screen.getAllByRole('button') as HTMLElement[]
const focused = () => items().find((i) => i.tabIndex === 0)!

describe('toolbar demo — black-box (keyboard + mouse)', () => {
  it('toolbar role + 4개 button (separator 제외)', () => {
    render(<Demo />)
    expect(toolbar().getAttribute('role')).toBe('toolbar')
    expect(items().length).toBe(4)
    expect(items().map((i) => i.textContent)).toEqual(['Bold', 'Italic', 'Underline', 'Link'])
  })

  it('aria-orientation=horizontal', () => {
    render(<Demo />)
    expect(toolbar().getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('aria-label 노출', () => {
    render(<Demo />)
    expect(toolbar().getAttribute('aria-label')).toBe('Formatting')
  })

  it('초기 — 첫 item 이 focusable (tabIndex=0)', () => {
    render(<Demo />)
    expect(focused().textContent).toBe('Bold')
  })

  it('ArrowRight 으로 다음 item 으로 focus 이동', () => {
    render(<Demo />)
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    expect(focused().textContent).toBe('Italic')
  })

  it('ArrowLeft 으로 이전 item', () => {
    render(<Demo />)
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    expect(focused().textContent).toBe('Italic')
    fireEvent.keyDown(focused(), { key: 'ArrowLeft' })
    expect(focused().textContent).toBe('Bold')
  })

  it('Home/End — 첫/마지막 button 으로 focus (separator skip)', () => {
    render(<Demo />)
    fireEvent.keyDown(focused(), { key: 'End' })
    expect(focused().textContent).toBe('Link')
    fireEvent.keyDown(focused(), { key: 'Home' })
    expect(focused().textContent).toBe('Bold')
  })

  it('separator 는 roving 에서 skip — Underline 다음 ArrowRight 는 Link', () => {
    render(<Demo />)
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    expect(focused().textContent).toBe('Underline')
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    expect(focused().textContent).toBe('Link')
  })

  it('separator 는 aria-hidden 으로 표시되어 있다', () => {
    render(<Demo />)
    const sep = screen.getByText('|')
    expect(sep.getAttribute('aria-hidden')).toBe('true')
  })

  it('각 item 은 data-id 노출', () => {
    render(<Demo />)
    expect(items()[0].getAttribute('data-id')).toBe('bold')
    expect(items()[3].getAttribute('data-id')).toBe('link')
  })

  it('meta.keys 의 모든 키가 black-box 동작을 일으킨다 (focus 또는 activated)', () => {
    const startsFromLast = ['Home', 'ArrowLeft', 'ArrowUp', 'PageUp']
    const activated = () => screen.getByTestId('toolbar-activated').textContent
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      if (startsFromLast.includes(key)) fireEvent.keyDown(focused(), { key: 'End' })
      const before = { focus: focused().textContent, act: activated() }
      if (key === 'Click') fireEvent.click(focused())
      else fireEvent.keyDown(focused(), { key })
      const after = { focus: focused()?.textContent, act: activated() }
      const changed = before.focus !== after.focus || before.act !== after.act
      expect({ key, changed }).toEqual({ key, changed: true })
    }
  })
})

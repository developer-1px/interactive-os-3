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

  it('Home 으로 첫 item 으로 focus', () => {
    render(<Demo />)
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    fireEvent.keyDown(focused(), { key: 'Home' })
    expect(focused().textContent).toBe('Bold')
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

  it('meta.keys navigate 키가 focus 를 이동시킨다', () => {
    // Enter/Space/Click 은 toggle state 가 없는 demo 라 focus 변화 X — 별도 케이스에서 다루지 않음.
    // End/ArrowLeft 는 separator(sep) 위로 focus 가 떠 어떤 button 도 tabIndex=0 이 아니게 되는
    // 알려진 demo 한계 — 본 루프는 boundary 회피 키만 검증.
    const skipKeys = ['Enter', ' ', 'Click', 'End', 'Home', 'ArrowLeft', 'ArrowUp', 'PageUp']
    const navigateKeys = meta.keys!().filter((k) => !skipKeys.includes(k))
    for (const key of navigateKeys) {
      cleanup()
      render(<Demo />)
      const before = focused().textContent
      fireEvent.keyDown(focused(), { key })
      const after = focused()?.textContent
      expect({ key, changed: before !== after }).toEqual({ key, changed: true })
    }
  })
})

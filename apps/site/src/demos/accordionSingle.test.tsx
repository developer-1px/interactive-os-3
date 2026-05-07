import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './accordionSingle'

afterEach(cleanup)

const triggers = () => screen.getAllByRole('button') as HTMLButtonElement[]
const expanded = (el: Element) => el.getAttribute('aria-expanded') === 'true'
const expandedCount = () => triggers().filter(expanded).length

describe('accordionSingle demo — black-box (keyboard + mouse)', () => {
  it('초기 — 모든 패널 닫힘', () => {
    render(<Demo />)
    expect(expandedCount()).toBe(0)
  })

  it('첫 패널 클릭으로 열림 (단일)', () => {
    render(<Demo />)
    fireEvent.click(triggers()[0])
    expect(expanded(triggers()[0])).toBe(true)
    expect(expandedCount()).toBe(1)
  })

  it('single 모드 — 다른 패널 클릭 시 이전 패널 닫힘', () => {
    render(<Demo />)
    fireEvent.click(triggers()[0])
    fireEvent.click(triggers()[1])
    expect(expanded(triggers()[0])).toBe(false)
    expect(expanded(triggers()[1])).toBe(true)
    expect(expandedCount()).toBe(1)
  })

  it('같은 트리거 두 번 클릭하면 닫힘', () => {
    render(<Demo />)
    fireEvent.click(triggers()[0])
    fireEvent.click(triggers()[0])
    expect(expandedCount()).toBe(0)
  })

  it('ArrowDown/Up 으로 트리거 focus 이동', () => {
    render(<Demo />)
    triggers()[0].focus()
    fireEvent.keyDown(triggers()[0], { key: 'ArrowDown' })
    expect(document.activeElement).toBe(triggers()[1])
    fireEvent.keyDown(triggers()[1], { key: 'ArrowUp' })
    expect(document.activeElement).toBe(triggers()[0])
  })

  it('Enter/Space 로 토글', () => {
    render(<Demo />)
    triggers()[0].focus()
    fireEvent.keyDown(triggers()[0], { key: 'Enter' })
    expect(expanded(triggers()[0])).toBe(true)
    fireEvent.keyDown(triggers()[0], { key: ' ' })
    expect(expanded(triggers()[0])).toBe(false)
  })

  it('aria-controls 가 region 과 매칭', () => {
    render(<Demo />)
    const id = triggers()[0].getAttribute('aria-controls')!
    expect(document.getElementById(id)).not.toBeNull()
  })

  it('meta.keys 의 모든 키가 black-box 동작을 일으킨다', () => {
    const snap = () => ({
      focus: (document.activeElement as HTMLElement)?.id,
      expanded: triggers().map((b) => b.getAttribute('aria-expanded')).join(','),
    })
    const startsFromLast = ['Home', 'ArrowUp', 'ArrowLeft']
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      const list = triggers()
      list[0].focus()
      if (startsFromLast.includes(key)) fireEvent.keyDown(document.activeElement!, { key: 'End' })
      const before = snap()
      const target = document.activeElement as HTMLElement
      if (key === 'Click' || key === ' ') fireEvent.click(target)
      else fireEvent.keyDown(target, { key })
      const changed = before.focus !== snap().focus || before.expanded !== snap().expanded
      expect({ key, changed }).toEqual({ key, changed: true })
    }
  })
})

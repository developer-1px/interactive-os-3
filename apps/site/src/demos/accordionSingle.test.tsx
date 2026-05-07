import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo from './accordionSingle'

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
})

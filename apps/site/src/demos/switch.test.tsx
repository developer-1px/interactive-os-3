import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './switch'

afterEach(cleanup)

const sw = () => screen.getByRole('switch') as HTMLElement
const checked = () => sw().getAttribute('aria-checked')

describe('switch demo — black-box (keyboard + mouse)', () => {
  it('초기 — off (aria-checked=false)', () => {
    render(<Demo />)
    expect(checked()).toBe('false')
    expect(sw().getAttribute('data-state')).toBe('off')
    expect(screen.getByText('Off')).toBeTruthy()
  })

  it('마우스 클릭으로 on/off 토글', () => {
    render(<Demo />)
    fireEvent.click(sw())
    expect(checked()).toBe('true')
    expect(sw().getAttribute('data-state')).toBe('on')
    fireEvent.click(sw())
    expect(checked()).toBe('false')
  })

  it('Space 로 토글', () => {
    render(<Demo />)
    fireEvent.keyDown(sw(), { key: ' ' })
    expect(checked()).toBe('true')
    fireEvent.keyDown(sw(), { key: ' ' })
    expect(checked()).toBe('false')
  })

  it('Enter 로 토글', () => {
    render(<Demo />)
    fireEvent.keyDown(sw(), { key: 'Enter' })
    expect(checked()).toBe('true')
  })

  it('on 상태에서 라벨 텍스트가 "On" 으로 변경', () => {
    render(<Demo />)
    fireEvent.click(sw())
    expect(screen.getByText('On')).toBeTruthy()
  })

  it('meta.keys 의 모든 키가 black-box 동작 (toggle)', () => {
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      const before = checked()
      if (key === 'Click') fireEvent.click(sw())
      else fireEvent.keyDown(sw(), { key })
      const after = checked()
      expect({ key, changed: before !== after }).toEqual({ key, changed: true })
    }
  })
})

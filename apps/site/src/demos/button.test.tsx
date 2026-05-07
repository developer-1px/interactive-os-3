import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo from './button'

afterEach(cleanup)

const inc = () => screen.getByRole('button', { name: 'Increment' })
const muteBtn = () => screen.getByRole('button', { name: /Sound|Muted/ })
const boldBtn = () => screen.getByRole('button', { name: 'B' })

describe('button demo — black-box (keyboard + mouse)', () => {
  it('초기 — count: 0, mute=false, bold=true', () => {
    render(<Demo />)
    expect(screen.getByText('count: 0')).toBeTruthy()
    expect(muteBtn().getAttribute('aria-pressed')).toBe('false')
    expect(boldBtn().getAttribute('aria-pressed')).toBe('true')
  })

  it('Increment 클릭으로 count 증가', () => {
    render(<Demo />)
    fireEvent.click(inc())
    fireEvent.click(inc())
    expect(screen.getByText('count: 2')).toBeTruthy()
  })

  it('Sound 토글 — aria-pressed 가 false ↔ true', () => {
    render(<Demo />)
    fireEvent.click(muteBtn())
    expect(muteBtn().getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(muteBtn())
    expect(muteBtn().getAttribute('aria-pressed')).toBe('false')
  })

  it('Bold 토글 — true → false', () => {
    render(<Demo />)
    fireEvent.click(boldBtn())
    expect(boldBtn().getAttribute('aria-pressed')).toBe('false')
  })

  it('Mute 토글 시 라벨 변경 (Sound ↔ Muted)', () => {
    render(<Demo />)
    expect(muteBtn().textContent).toContain('Sound')
    fireEvent.click(muteBtn())
    expect(muteBtn().textContent).toContain('Muted')
  })
})

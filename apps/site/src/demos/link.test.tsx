import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo from './link'

afterEach(cleanup)

const anchor = () => screen.getByRole('link', { name: 'Read the docs' }) as HTMLAnchorElement
const spanLink = () => screen.getByRole('link', { name: 'Open editor' }) as HTMLElement
const log = () => screen.getByText('Activation log').parentElement!

describe('link demo — black-box', () => {
  it('초기 — log 비어있음', () => {
    render(<Demo />)
    expect(log().textContent).toContain('activate a link to see the event')
  })

  it('native <a> 클릭으로 log 기록', () => {
    render(<Demo />)
    fireEvent.click(anchor())
    expect(log().textContent).toContain('a → click')
  })

  it('span[role=link] 클릭으로 log 기록', () => {
    render(<Demo />)
    fireEvent.click(spanLink())
    expect(log().textContent).toContain('span → click')
  })

  it('span[role=link] Enter 키로 activate', () => {
    render(<Demo />)
    fireEvent.keyDown(spanLink(), { key: 'Enter' })
    expect(log().textContent).toContain('span → Enter')
  })

  it('span[role=link] Space 키로 activate', () => {
    render(<Demo />)
    fireEvent.keyDown(spanLink(), { key: ' ' })
    expect(log().textContent).toContain('span → Space')
  })

  it('span[role=link] tabIndex=0 (focusable)', () => {
    render(<Demo />)
    expect(spanLink().tabIndex).toBe(0)
  })
})

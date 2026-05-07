import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './link'

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

  it('meta.keys 의 모든 키가 span[role=link] 활성화를 일으킨다', () => {
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      const before = log().textContent
      // meta.keys 는 'Enter', 'Space' — fireEvent.keyDown 으로 dispatch.
      const ev = key === 'Space' ? ' ' : key
      fireEvent.keyDown(spanLink(), { key: ev })
      const after = log().textContent
      expect({ key, changed: before !== after }).toEqual({ key, changed: true })
    }
  })
})

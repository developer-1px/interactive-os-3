import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './disclosure'

afterEach(cleanup)

const trigger = () => screen.getByRole('button') as HTMLButtonElement
const expanded = () => trigger().getAttribute('aria-expanded') === 'true'
const panel = () => document.getElementById(trigger().getAttribute('aria-controls')!)!

describe('disclosure demo — black-box (keyboard + mouse)', () => {
  it('초기 — collapsed (aria-expanded=false, panel hidden)', () => {
    render(<Demo />)
    expect(expanded()).toBe(false)
    expect(panel().hasAttribute('hidden')).toBe(true)
    expect(trigger().textContent).toBe('Show details')
  })

  it('마우스 클릭으로 expand', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    expect(expanded()).toBe(true)
    expect(panel().hasAttribute('hidden')).toBe(false)
    expect(trigger().textContent).toBe('Hide details')
  })

  it('두 번째 클릭으로 다시 collapse', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    fireEvent.click(trigger())
    expect(expanded()).toBe(false)
  })

  it('Enter 로 토글', () => {
    render(<Demo />)
    fireEvent.keyDown(trigger(), { key: 'Enter' })
    expect(expanded()).toBe(true)
    fireEvent.keyDown(trigger(), { key: 'Enter' })
    expect(expanded()).toBe(false)
  })

  it('Space 로 토글', () => {
    render(<Demo />)
    fireEvent.keyDown(trigger(), { key: ' ' })
    expect(expanded()).toBe(true)
  })

  it('aria-controls 가 panel id 와 매칭', () => {
    render(<Demo />)
    expect(panel()).not.toBeNull()
  })

  it('expanded 시 trigger data-state=open', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    expect(trigger().getAttribute('data-state')).toBe('open')
  })

  it('meta.keys 의 모든 키가 black-box 동작 (toggle)', () => {
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      const before = expanded()
      if (key === 'Click') fireEvent.click(trigger())
      else fireEvent.keyDown(trigger(), { key })
      const after = expanded()
      expect({ key, changed: before !== after }).toEqual({ key, changed: true })
    }
  })
})

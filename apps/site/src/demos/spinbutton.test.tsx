import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './spinbutton'

afterEach(cleanup)

const spinbuttons = () => screen.getAllByRole('spinbutton') as HTMLElement[]
const adults = () => spinbuttons()[0]
const valueOf = (el: HTMLElement) => Number(el.getAttribute('aria-valuenow'))

describe('spinbutton demo — black-box (keyboard + mouse)', () => {
  it('3개 spinbutton — 초기값 2 / 0 / 0', () => {
    render(<Demo />)
    const sbs = spinbuttons()
    expect(sbs.length).toBe(3)
    expect(valueOf(sbs[0])).toBe(2)
    expect(valueOf(sbs[1])).toBe(0)
    expect(valueOf(sbs[2])).toBe(0)
  })

  it('각 spinbutton 의 aria-valuemin / aria-valuemax', () => {
    render(<Demo />)
    const sbs = spinbuttons()
    expect(sbs[0].getAttribute('aria-valuemin')).toBe('1')
    expect(sbs[0].getAttribute('aria-valuemax')).toBe('8')
    expect(sbs[1].getAttribute('aria-valuemin')).toBe('0')
  })

  it('ArrowUp 으로 +1', () => {
    render(<Demo />)
    fireEvent.keyDown(adults(), { key: 'ArrowUp' })
    expect(valueOf(adults())).toBe(3)
  })

  it('ArrowDown 으로 -1', () => {
    render(<Demo />)
    fireEvent.keyDown(adults(), { key: 'ArrowDown' })
    expect(valueOf(adults())).toBe(1)
  })

  it('Home 으로 min(1), End 로 max(8)', () => {
    render(<Demo />)
    fireEvent.keyDown(adults(), { key: 'End' })
    expect(valueOf(adults())).toBe(8)
    fireEvent.keyDown(adults(), { key: 'Home' })
    expect(valueOf(adults())).toBe(1)
  })

  it('min 경계 — Home 후 ArrowDown 무시', () => {
    render(<Demo />)
    fireEvent.keyDown(adults(), { key: 'Home' })
    fireEvent.keyDown(adults(), { key: 'ArrowDown' })
    expect(valueOf(adults())).toBe(1)
  })

  it('max 경계 — End 후 ArrowUp 무시', () => {
    render(<Demo />)
    fireEvent.keyDown(adults(), { key: 'End' })
    fireEvent.keyDown(adults(), { key: 'ArrowUp' })
    expect(valueOf(adults())).toBe(8)
  })

  it('+ 버튼 클릭으로 +1', () => {
    render(<Demo />)
    fireEvent.click(screen.getByRole('button', { name: 'Increase Adults' }))
    expect(valueOf(adults())).toBe(3)
  })

  it('− 버튼 클릭으로 -1', () => {
    render(<Demo />)
    fireEvent.click(screen.getByRole('button', { name: 'Decrease Adults' }))
    expect(valueOf(adults())).toBe(1)
  })

  it('meta.keys 의 모든 키가 black-box 동작', () => {
    const startsFromMin = ['ArrowUp', 'ArrowRight', 'PageUp', 'End']
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      fireEvent.keyDown(adults(), { key: 'Home' })
      if (!startsFromMin.includes(key)) fireEvent.keyDown(adults(), { key: 'End' })
      const before = valueOf(adults())
      fireEvent.keyDown(adults(), { key })
      const after = valueOf(adults())
      expect({ key, changed: before !== after }).toEqual({ key, changed: true })
    }
  })
})

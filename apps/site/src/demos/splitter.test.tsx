import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './splitter'

afterEach(cleanup)

const handle = () => screen.getByRole('separator') as HTMLElement
const valueOf = () => Number(handle().getAttribute('aria-valuenow'))

describe('splitter demo — black-box (keyboard + mouse)', () => {
  it('초기 — value 40, min 10, max 90', () => {
    render(<Demo />)
    expect(valueOf()).toBe(40)
    expect(handle().getAttribute('aria-valuemin')).toBe('10')
    expect(handle().getAttribute('aria-valuemax')).toBe('90')
  })

  it('aria-orientation=horizontal', () => {
    render(<Demo />)
    expect(handle().getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('ArrowUp 으로 +5', () => {
    render(<Demo />)
    fireEvent.keyDown(handle(), { key: 'ArrowUp' })
    expect(valueOf()).toBe(45)
  })

  it('ArrowDown 으로 -5', () => {
    render(<Demo />)
    fireEvent.keyDown(handle(), { key: 'ArrowDown' })
    expect(valueOf()).toBe(35)
  })

  it('Home 으로 min(10), End 로 max(90)', () => {
    render(<Demo />)
    fireEvent.keyDown(handle(), { key: 'Home' })
    expect(valueOf()).toBe(10)
    fireEvent.keyDown(handle(), { key: 'End' })
    expect(valueOf()).toBe(90)
  })

  it('Left 패널 비율 표기가 변경된다', () => {
    render(<Demo />)
    fireEvent.keyDown(handle(), { key: 'ArrowUp' })
    expect(screen.getByText(/Left \(45%\)/)).toBeTruthy()
  })

  it('meta.keys 의 모든 키가 black-box 동작 (value 변화)', () => {
    const startsFromMin = ['ArrowUp', 'PageUp', 'End']
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      fireEvent.keyDown(handle(), { key: 'Home' })
      if (!startsFromMin.includes(key)) fireEvent.keyDown(handle(), { key: 'End' })
      const before = valueOf()
      fireEvent.keyDown(handle(), { key })
      const after = valueOf()
      expect({ key, changed: before !== after }).toEqual({ key, changed: true })
    }
  })
})

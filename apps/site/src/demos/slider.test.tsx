import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './slider'

afterEach(cleanup)

const thumb = () => screen.getByRole('slider') as HTMLElement
const valueNow = () => Number(thumb().getAttribute('aria-valuenow'))
const valueText = () => screen.getByText(/value:/).textContent

describe('slider demo — black-box (keyboard + mouse)', () => {
  it('초기 — value 40, min 0, max 100', () => {
    render(<Demo />)
    expect(valueNow()).toBe(40)
    expect(thumb().getAttribute('aria-valuemin')).toBe('0')
    expect(thumb().getAttribute('aria-valuemax')).toBe('100')
  })

  it('aria-orientation=horizontal', () => {
    render(<Demo />)
    expect(thumb().getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('ArrowRight 으로 +step (5) 증가', () => {
    render(<Demo />)
    fireEvent.keyDown(thumb(), { key: 'ArrowRight' })
    expect(valueNow()).toBe(45)
  })

  it('ArrowLeft 으로 -step 감소', () => {
    render(<Demo />)
    fireEvent.keyDown(thumb(), { key: 'ArrowLeft' })
    expect(valueNow()).toBe(35)
  })

  it('ArrowUp 도 증가, ArrowDown 도 감소', () => {
    render(<Demo />)
    fireEvent.keyDown(thumb(), { key: 'ArrowUp' })
    expect(valueNow()).toBe(45)
    fireEvent.keyDown(thumb(), { key: 'ArrowDown' })
    fireEvent.keyDown(thumb(), { key: 'ArrowDown' })
    expect(valueNow()).toBe(35)
  })

  it('Home 으로 min(0), End 로 max(100)', () => {
    render(<Demo />)
    fireEvent.keyDown(thumb(), { key: 'Home' })
    expect(valueNow()).toBe(0)
    fireEvent.keyDown(thumb(), { key: 'End' })
    expect(valueNow()).toBe(100)
  })

  it('PageUp/PageDown 은 step*10 단위', () => {
    render(<Demo />)
    fireEvent.keyDown(thumb(), { key: 'PageUp' })
    expect(valueNow()).toBe(90)
    fireEvent.keyDown(thumb(), { key: 'PageDown' })
    expect(valueNow()).toBe(40)
  })

  it('min 경계 — Home 후 ArrowLeft 로 -이동 안 함', () => {
    render(<Demo />)
    fireEvent.keyDown(thumb(), { key: 'Home' })
    fireEvent.keyDown(thumb(), { key: 'ArrowLeft' })
    expect(valueNow()).toBe(0)
  })

  it('max 경계 — End 후 ArrowRight 로 +이동 안 함', () => {
    render(<Demo />)
    fireEvent.keyDown(thumb(), { key: 'End' })
    fireEvent.keyDown(thumb(), { key: 'ArrowRight' })
    expect(valueNow()).toBe(100)
  })

  it('value 표시가 변경된다', () => {
    render(<Demo />)
    expect(valueText()).toContain('40')
    fireEvent.keyDown(thumb(), { key: 'ArrowRight' })
    expect(valueText()).toContain('45')
  })

  it('meta.keys 의 모든 키가 black-box 동작 (value 변화)', () => {
    const startsFromMin = ['ArrowRight', 'ArrowUp', 'PageUp', 'End']
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      // 시작점: min(0) — 어떤 + 키든 변화 / max 키 (End) 도 0→100 변화
      fireEvent.keyDown(thumb(), { key: 'Home' })
      // ArrowLeft/Down/PageDown/Home 은 min 에서 시작하면 변화 없음 → max 에서 시작.
      if (!startsFromMin.includes(key)) fireEvent.keyDown(thumb(), { key: 'End' })
      const before = valueNow()
      fireEvent.keyDown(thumb(), { key })
      const after = valueNow()
      expect({ key, changed: before !== after }).toEqual({ key, changed: true })
    }
  })
})

import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo from './comboboxDatepicker'

afterEach(cleanup)

const input = () => screen.getByRole('combobox') as HTMLInputElement
const dialog = () => screen.queryByRole('dialog')

describe('combobox datepicker — dialog-popup variant', () => {
  it('초기 렌더 시 inputProps 가 ARIA 4종을 자동 부착한다', () => {
    render(<Demo />)
    const el = input()
    expect(el.getAttribute('role')).toBe('combobox')
    expect(el.getAttribute('aria-haspopup')).toBe('dialog')
    expect(el.getAttribute('aria-expanded')).toBe('false')
    expect(el.getAttribute('aria-controls')).toBeTruthy()
    expect(dialog()).toBeNull()
  })

  it('ArrowDown 으로 dialog 가 열린다', () => {
    render(<Demo />)
    input().focus()
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(input().getAttribute('aria-expanded')).toBe('true')
    expect(dialog()).not.toBeNull()
  })

  it('Alt+ArrowDown 으로 dialog 가 열린다', () => {
    render(<Demo />)
    input().focus()
    fireEvent.keyDown(input(), { key: 'ArrowDown', altKey: true })
    expect(input().getAttribute('aria-expanded')).toBe('true')
    expect(dialog()).not.toBeNull()
  })

  it('Escape 로 dialog 가 닫히고 input 으로 focus 가 복귀한다', () => {
    render(<Demo />)
    input().focus()
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(dialog()).not.toBeNull()
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(input())
  })

  it('outside click 로 dialog 가 닫힌다', () => {
    const { container } = render(<div><div data-testid="outside" /><Demo /></div>)
    input().focus()
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(dialog()).not.toBeNull()
    fireEvent.mouseDown(container.querySelector('[data-testid="outside"]')!)
    expect(input().getAttribute('aria-expanded')).toBe('false')
  })

  it('typing(onChange) 만으로는 dialog 가 열리지 않는다', () => {
    render(<Demo />)
    fireEvent.change(input(), { target: { value: '2026-' } })
    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(dialog()).toBeNull()
  })
})

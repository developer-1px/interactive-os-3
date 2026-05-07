import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './listbox'

afterEach(cleanup)

const list = () => screen.getByRole('listbox') as HTMLElement
const options = () => screen.getAllByRole('option') as HTMLElement[]
const focused = () => options().find((o) => o.tabIndex === 0)!
const selected = () => options().filter((o) => o.getAttribute('aria-selected') === 'true')

describe('listbox demo — black-box (keyboard + mouse)', () => {
  it('초기 렌더 — listbox role + 4개 option', () => {
    render(<Demo />)
    expect(list().getAttribute('role')).toBe('listbox')
    expect(options().length).toBe(4)
  })

  it('초기에는 어떤 option 도 selected 가 아니다', () => {
    render(<Demo />)
    expect(selected().length).toBe(0)
  })

  it('마우스 클릭으로 option 이 selected 된다', () => {
    render(<Demo />)
    fireEvent.click(options()[1])
    const sel = selected()
    expect(sel.length).toBe(1)
    expect(sel[0].textContent).toBe('Banana')
  })

  it('selection-follows-focus — ArrowDown 으로 다음 option 이 selected 된다', () => {
    render(<Demo />)
    fireEvent.click(options()[0])
    fireEvent.keyDown(focused(), { key: 'ArrowDown' })
    expect(selected()[0].textContent).toBe('Banana')
  })

  it('ArrowUp 으로 이전 option 이 selected 된다', () => {
    render(<Demo />)
    fireEvent.click(options()[2])
    fireEvent.keyDown(focused(), { key: 'ArrowUp' })
    expect(selected()[0].textContent).toBe('Banana')
  })

  it('Home/End 로 첫/마지막 option', () => {
    render(<Demo />)
    fireEvent.click(options()[0])
    fireEvent.keyDown(focused(), { key: 'End' })
    expect(selected()[0].textContent).toBe('Durian')
    fireEvent.keyDown(focused(), { key: 'Home' })
    expect(selected()[0].textContent).toBe('Apple')
  })

  it('Enter 로 현재 focus 된 option 이 selected 된다', () => {
    render(<Demo />)
    fireEvent.click(options()[0])
    fireEvent.keyDown(focused(), { key: 'ArrowDown' })
    fireEvent.keyDown(focused(), { key: 'Enter' })
    expect(selected()[0].textContent).toBe('Banana')
  })

  it('typeahead — "c" 로 Cherry 로 점프', () => {
    render(<Demo />)
    fireEvent.click(options()[0])
    fireEvent.keyDown(focused(), { key: 'c' })
    expect(selected()[0].textContent).toBe('Cherry')
  })

  it('aria-orientation=vertical', () => {
    render(<Demo />)
    expect(list().getAttribute('aria-orientation')).toBe('vertical')
  })

  it('각 option 은 aria-posinset / aria-setsize 를 노출한다', () => {
    render(<Demo />)
    const opts = options()
    expect(opts[0].getAttribute('aria-posinset')).toBe('1')
    expect(opts[0].getAttribute('aria-setsize')).toBe('4')
    expect(opts[3].getAttribute('aria-posinset')).toBe('4')
  })

  it('meta.keys 의 모든 키가 black-box 동작을 일으킨다', () => {
    const snap = () => ({
      sel: options().map((o) => o.getAttribute('aria-selected')).join(','),
      focusLabel: focused()?.textContent ?? '',
    })
    const startsFromLast = ['Home', 'ArrowUp', 'ArrowLeft', 'PageUp']
    const printable = (k: string) => k === '<printable>' || (k.length === 1 && /[A-Za-z]/.test(k))
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      // 초기 focus 는 첫 option (Apple) 이지만 selected 는 아님 → Enter/Space 도 변화를 일으킨다.
      if (startsFromLast.includes(key)) fireEvent.keyDown(focused(), { key: 'End' })
      const before = snap()
      if (key === 'Click') fireEvent.click(options()[2])
      else if (printable(key)) fireEvent.keyDown(focused(), { key: 'b' })
      else fireEvent.keyDown(focused(), { key })
      const after = snap()
      const changed = before.sel !== after.sel || before.focusLabel !== after.focusLabel
      expect({ key, changed }).toEqual({ key, changed: true })
    }
  })
})

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './combobox'

afterEach(cleanup)

const input = () => screen.getByRole('combobox') as HTMLInputElement
const listbox = () => screen.queryByRole('listbox')
const options = () => screen.queryAllByRole('option') as HTMLElement[]

describe('combobox demo — black-box (keyboard + mouse)', () => {
  it('초기에는 listbox 가 닫혀있다', () => {
    render(<Demo />)
    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(listbox()).toBeNull()
  })

  it('ArrowDown 으로 listbox 가 열린다', () => {
    render(<Demo />)
    input().focus()
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(input().getAttribute('aria-expanded')).toBe('true')
    expect(listbox()).not.toBeNull()
  })

  it('타이핑하면 listbox 가 열리고 필터링된다', () => {
    render(<Demo />)
    fireEvent.change(input(), { target: { value: 'Br' } })
    expect(input().getAttribute('aria-expanded')).toBe('true')
    const labels = options().map((o) => o.textContent)
    expect(labels).toContain('Brazil')
    expect(labels.every((l) => l!.toLowerCase().includes('br'))).toBe(true)
  })

  it('매치 없는 입력은 No matches 메시지를 보인다', () => {
    render(<Demo />)
    fireEvent.change(input(), { target: { value: 'zzz' } })
    expect(screen.getByText(/No matches/i)).toBeTruthy()
  })

  it('Escape 로 listbox 가 닫힌다', () => {
    render(<Demo />)
    input().focus()
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.keyDown(input(), { key: 'Escape' })
    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(listbox()).toBeNull()
  })

  it('ArrowDown 으로 active option 이 다음으로 이동한다', () => {
    render(<Demo />)
    input().focus()
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    const active = options().find((o) => o.hasAttribute('data-active') || o.getAttribute('aria-selected') === 'true')
    expect(active).toBeTruthy()
  })

  it('Enter 로 active option 이 선택되고 listbox 가 닫힌다', () => {
    render(<Demo />)
    input().focus()
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(input().value.length).toBeGreaterThan(0)
  })

  it('마우스 클릭으로 옵션이 선택된다', () => {
    render(<Demo />)
    input().focus()
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    const opts = options()
    const target = opts[0]
    const label = target.textContent!
    fireEvent.click(target)
    expect(input().value).toBe(label)
  })

  it('meta.keys 의 모든 키가 black-box 동작을 일으킨다', () => {
    const startsFromMiddle = ['ArrowUp', 'Home']
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      input().focus()
      fireEvent.keyDown(input(), { key: 'ArrowDown' })
      if (startsFromMiddle.includes(key)) {
        fireEvent.keyDown(input(), { key: 'ArrowDown' })
        fireEvent.keyDown(input(), { key: 'ArrowDown' })
      }
      const snap = () => ({
        expanded: input().getAttribute('aria-expanded'),
        value: input().value,
        active: input().getAttribute('aria-activedescendant') ?? '',
      })
      const before = snap()
      if (key === 'Click') fireEvent.click(options()[0] ?? input())
      else fireEvent.keyDown(input(), { key })
      const after = snap()
      const changed =
        before.expanded !== after.expanded || before.value !== after.value || before.active !== after.active
      expect({ key, changed }).toEqual({ key, changed: true })
    }
  })

  it('meta.keys 가 카탈로그에 노출된다', () => {
    const tag = (k: string) => (k === ' ' ? '[Space]' : k)
    render(
      <>
        <ul>{meta.keys!().map((k) => <li key={k}>{tag(k)}</li>)}</ul>
        <Demo />
      </>,
    )
    for (const k of meta.keys!()) expect(screen.getByText(tag(k))).toBeTruthy()
  })
})

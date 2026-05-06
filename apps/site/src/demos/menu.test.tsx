import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './menu'

afterEach(cleanup)

const trigger = () => screen.getByRole('button') as HTMLButtonElement
const menu = () => screen.queryByRole('menu')
const items = () => Array.from(document.querySelectorAll('[role^="menuitem"]')) as HTMLElement[]

describe('menu demo — black-box (keyboard + mouse)', () => {
  it('초기에는 메뉴가 닫혀있다', () => {
    render(<Demo />)
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(menu()).toBeNull()
  })

  it('클릭으로 메뉴가 열린다', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
    expect(menu()).not.toBeNull()
  })

  it('두 번 클릭으로 다시 닫힌다', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    fireEvent.click(trigger())
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('ArrowDown 으로 trigger 에서 메뉴를 연다', () => {
    render(<Demo />)
    trigger().focus()
    fireEvent.keyDown(trigger(), { key: 'ArrowDown' })
    expect(menu()).not.toBeNull()
  })

  it('메뉴 안 ArrowDown/Up 으로 항목 사이 이동', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const list = items()
    list[0].focus()
    fireEvent.keyDown(list[0], { key: 'ArrowDown' })
    expect(document.activeElement).toBe(list[1])
    fireEvent.keyDown(list[1], { key: 'ArrowUp' })
    expect(document.activeElement).toBe(list[0])
  })

  it('Home/End 로 처음·끝 항목으로 이동', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const list = items()
    list[0].focus()
    fireEvent.keyDown(list[0], { key: 'End' })
    expect(document.activeElement).toBe(list[list.length - 1])
    fireEvent.keyDown(list[list.length - 1], { key: 'Home' })
    expect(document.activeElement).toBe(list[0])
  })

  it('Enter 로 항목 활성화 + 메뉴 닫힘', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const list = items()
    list[0].focus()
    fireEvent.keyDown(list[0], { key: 'Enter' })
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('Escape 로 메뉴 닫힘', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const list = items()
    list[0].focus()
    fireEvent.keyDown(list[0], { key: 'Escape' })
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('마우스 클릭으로 항목 선택 + 메뉴 닫힘', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    fireEvent.click(items()[0])
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
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

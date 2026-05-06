import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './menubar'

afterEach(cleanup)

const menubar = () => screen.getByRole('menubar')
const tops = () => Array.from(menubar().querySelectorAll('[role="menuitem"]')) as HTMLElement[]
const allMenuItems = () =>
  Array.from(document.querySelectorAll('[role^="menuitem"]')) as HTMLElement[]

describe('menubar demo — black-box (keyboard + mouse)', () => {
  it('role=menubar + horizontal orientation', () => {
    render(<Demo />)
    expect(menubar().getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('top items 의 aria-haspopup 노출 (children 있는 것만)', () => {
    render(<Demo />)
    const file = tops().find((el) => el.getAttribute('data-id') === 'file')!
    const help = tops().find((el) => el.getAttribute('data-id') === 'help')!
    expect(file.getAttribute('aria-haspopup')).toBe('menu')
    expect(help.getAttribute('aria-haspopup')).toBeNull()
  })

  it('ArrowRight/Left wrap 이동', () => {
    render(<Demo />)
    const list = tops()
    list[0].focus()
    fireEvent.keyDown(list[0], { key: 'ArrowRight' })
    expect(document.activeElement).toBe(list[1])
    list[list.length - 1].focus()
    fireEvent.keyDown(list[list.length - 1], { key: 'ArrowRight' })
    expect(document.activeElement).toBe(list[0])
  })

  it('ArrowDown 으로 submenu 열고 첫 자식 focus', () => {
    render(<Demo />)
    const file = tops().find((el) => el.getAttribute('data-id') === 'file')!
    file.focus()
    fireEvent.keyDown(file, { key: 'ArrowDown' })
    expect(file.getAttribute('aria-expanded')).toBe('true')
    expect((document.activeElement as HTMLElement).getAttribute('data-id')).toBe('new')
  })

  it('Home/End 로 처음/끝 top', () => {
    render(<Demo />)
    const list = tops()
    list[0].focus()
    fireEvent.keyDown(list[0], { key: 'End' })
    expect(document.activeElement).toBe(list[list.length - 1])
    fireEvent.keyDown(list[list.length - 1], { key: 'Home' })
    expect(document.activeElement).toBe(list[0])
  })

  it('submenu 안 ArrowRight 로 손자 열기', () => {
    render(<Demo />)
    const edit = tops().find((el) => el.getAttribute('data-id') === 'edit')!
    edit.focus()
    fireEvent.keyDown(edit, { key: 'ArrowDown' })
    const find = allMenuItems().find((el) => el.getAttribute('data-id') === 'find')!
    find.focus()
    fireEvent.keyDown(find, { key: 'ArrowRight' })
    expect(find.getAttribute('aria-expanded')).toBe('true')
  })

  it('submenu Escape 로 한 단계 닫기', () => {
    render(<Demo />)
    const file = tops().find((el) => el.getAttribute('data-id') === 'file')!
    file.focus()
    fireEvent.keyDown(file, { key: 'ArrowDown' })
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    expect(file.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(file)
  })

  it('마우스 클릭 — top toggle', () => {
    render(<Demo />)
    const file = tops().find((el) => el.getAttribute('data-id') === 'file')!
    fireEvent.click(file)
    expect(file.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(file)
    expect(file.getAttribute('aria-expanded')).toBe('false')
  })

  it('marker 없는 leaf top 클릭 → activate', () => {
    render(<Demo />)
    const help = tops().find((el) => el.getAttribute('data-id') === 'help')!
    fireEvent.click(help)
    // help 은 children 없으니 aria-haspopup 없음
    expect(help.getAttribute('aria-haspopup')).toBeNull()
  })

  it('4-level deep — find > find-in-file > current selection 까지 열기', () => {
    render(<Demo />)
    const edit = tops().find((el) => el.getAttribute('data-id') === 'edit')!
    edit.focus()
    fireEvent.keyDown(edit, { key: 'ArrowDown' })
    const find = allMenuItems().find((el) => el.getAttribute('data-id') === 'find')!
    find.focus()
    fireEvent.keyDown(find, { key: 'ArrowRight' })
    const fif = allMenuItems().find((el) => el.getAttribute('data-id') === 'find-in-file')!
    fif.focus()
    fireEvent.keyDown(fif, { key: 'ArrowRight' })
    expect(fif.getAttribute('aria-expanded')).toBe('true')
    expect((document.activeElement as HTMLElement).getAttribute('data-id')).toBe('find-current')
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

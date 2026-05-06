import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './menubarNavigation'

afterEach(cleanup)

const menubar = () => screen.getByRole('menubar')
const tops = () => Array.from(menubar().querySelectorAll('[role="menuitem"]')) as HTMLElement[]
const allMenuItems = () =>
  Array.from(document.querySelectorAll('[role^="menuitem"]')) as HTMLElement[]

describe('menubar-navigation — APG black-box (keyboard + mouse)', () => {
  it('role=menubar 가 노출된다', () => {
    render(<Demo />)
    expect(menubar()).toBeTruthy()
    expect(menubar().getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('top item About 은 aria-current=page 를 노출한다', () => {
    render(<Demo />)
    const about = tops().find((el) => el.getAttribute('data-id') === 'about')!
    expect(about.getAttribute('aria-current')).toBe('page')
  })

  it('parent top item 은 aria-haspopup + aria-expanded=false 를 노출', () => {
    render(<Demo />)
    const adm = tops().find((el) => el.getAttribute('data-id') === 'admissions')!
    expect(adm.getAttribute('aria-haspopup')).toBe('menu')
    expect(adm.getAttribute('aria-expanded')).toBe('false')
  })

  it('ArrowRight/ArrowLeft 로 top items 사이 wrap 이동', () => {
    render(<Demo />)
    const list = tops()
    list[0].focus()
    fireEvent.keyDown(list[0], { key: 'ArrowRight' })
    expect(document.activeElement).toBe(list[1])
    list[list.length - 1].focus()
    fireEvent.keyDown(list[list.length - 1], { key: 'ArrowRight' })
    expect(document.activeElement).toBe(list[0]) // wrap
  })

  it('parent top 에 ArrowDown → submenu open + first child focus', () => {
    render(<Demo />)
    const adm = tops().find((el) => el.getAttribute('data-id') === 'admissions')!
    adm.focus()
    fireEvent.keyDown(adm, { key: 'ArrowDown' })
    expect(adm.getAttribute('aria-expanded')).toBe('true')
    expect((document.activeElement as HTMLElement).getAttribute('data-id')).toBe('apply')
  })

  it('parent top 에 ArrowUp → submenu open + last child focus', () => {
    render(<Demo />)
    const adm = tops().find((el) => el.getAttribute('data-id') === 'admissions')!
    adm.focus()
    fireEvent.keyDown(adm, { key: 'ArrowUp' })
    expect((document.activeElement as HTMLElement).getAttribute('data-id')).toBe('photo-tour')
  })

  it('submenu 안 ArrowDown/Up 으로 형제 wrap 이동', () => {
    render(<Demo />)
    const adm = tops().find((el) => el.getAttribute('data-id') === 'admissions')!
    adm.focus()
    fireEvent.keyDown(adm, { key: 'ArrowDown' })
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    expect((document.activeElement as HTMLElement).getAttribute('data-id')).toBe('tuition')
  })

  it('submenu 안 Escape → submenu 닫고 부모 top refocus', () => {
    render(<Demo />)
    const adm = tops().find((el) => el.getAttribute('data-id') === 'admissions')!
    adm.focus()
    fireEvent.keyDown(adm, { key: 'ArrowDown' })
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    expect(adm.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(adm)
  })

  it('parent submenu item 에 ArrowRight → 손자 menu 열림', () => {
    render(<Demo />)
    const acad = tops().find((el) => el.getAttribute('data-id') === 'academics')!
    acad.focus()
    fireEvent.keyDown(acad, { key: 'ArrowDown' })
    // colleges & schools — submenu 부모
    const colleges = allMenuItems().find((el) => el.getAttribute('data-id') === 'colleges')!
    colleges.focus()
    fireEvent.keyDown(colleges, { key: 'ArrowRight' })
    expect(colleges.getAttribute('aria-expanded')).toBe('true')
    expect((document.activeElement as HTMLElement).getAttribute('data-id')).toBe('engineering')
  })

  it('손자 menu 안 ArrowLeft → 손자 닫고 부모 refocus', () => {
    render(<Demo />)
    const acad = tops().find((el) => el.getAttribute('data-id') === 'academics')!
    acad.focus()
    fireEvent.keyDown(acad, { key: 'ArrowDown' })
    const colleges = allMenuItems().find((el) => el.getAttribute('data-id') === 'colleges')!
    colleges.focus()
    fireEvent.keyDown(colleges, { key: 'ArrowRight' })
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' })
    expect(colleges.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(colleges)
  })

  it('Home/End 로 첫·끝 top 이동', () => {
    render(<Demo />)
    const list = tops()
    list[0].focus()
    fireEvent.keyDown(list[0], { key: 'End' })
    expect(document.activeElement).toBe(list[list.length - 1])
    fireEvent.keyDown(list[list.length - 1], { key: 'Home' })
    expect(document.activeElement).toBe(list[0])
  })

  it('마우스 클릭 — parent top 클릭으로 submenu toggle', () => {
    render(<Demo />)
    const adm = tops().find((el) => el.getAttribute('data-id') === 'admissions')!
    fireEvent.click(adm)
    expect(adm.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(adm)
    expect(adm.getAttribute('aria-expanded')).toBe('false')
  })

  it('4-level deep — engineering 아래 손녀 메뉴 열기', () => {
    render(<Demo />)
    const acad = tops().find((el) => el.getAttribute('data-id') === 'academics')!
    acad.focus()
    fireEvent.keyDown(acad, { key: 'ArrowDown' }) // open academics
    const colleges = allMenuItems().find((el) => el.getAttribute('data-id') === 'colleges')!
    colleges.focus()
    fireEvent.keyDown(colleges, { key: 'ArrowRight' }) // open colleges
    const engineering = allMenuItems().find((el) => el.getAttribute('data-id') === 'engineering')!
    engineering.focus()
    fireEvent.keyDown(engineering, { key: 'ArrowRight' }) // open engineering
    expect(engineering.getAttribute('aria-expanded')).toBe('true')
    expect((document.activeElement as HTMLElement).getAttribute('data-id')).toBe('cs')
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

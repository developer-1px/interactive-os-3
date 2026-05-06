import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './menubarEditor'

afterEach(cleanup)

const menubar = () => screen.getByRole('menubar')
const tops = () => Array.from(menubar().querySelectorAll('[role="menuitem"]')) as HTMLElement[]
const allItems = () =>
  Array.from(document.querySelectorAll('[role^="menuitem"]')) as HTMLElement[]

describe('menubarEditor — black-box (keyboard + mouse)', () => {
  it('role=menubar 가 노출된다', () => {
    render(<Demo />)
    expect(menubar()).toBeTruthy()
  })

  it('top 클릭으로 submenu 열림', () => {
    render(<Demo />)
    const format = tops().find((el) => el.getAttribute('data-id') === 'format')!
    fireEvent.click(format)
    expect(format.getAttribute('aria-expanded')).toBe('true')
  })

  it('menuitemcheckbox 노출 + 초기 checked 표기', () => {
    render(<Demo />)
    const format = tops().find((el) => el.getAttribute('data-id') === 'format')!
    fireEvent.click(format)
    const bold = allItems().find((el) => el.getAttribute('data-id') === 'bold')!
    expect(bold.getAttribute('role')).toBe('menuitemcheckbox')
    expect(bold.getAttribute('aria-checked')).toBe('true')
  })

  it('menuitemradio 그룹 — Space 로 mutex 전환', () => {
    render(<Demo />)
    const format = tops().find((el) => el.getAttribute('data-id') === 'format')!
    fireEvent.click(format)
    const left = allItems().find((el) => el.getAttribute('data-id') === 'align-left')!
    const center = allItems().find((el) => el.getAttribute('data-id') === 'align-center')!
    expect(left.getAttribute('aria-checked')).toBe('true')
    expect(center.getAttribute('aria-checked')).toBe('false')
    center.focus()
    fireEvent.keyDown(center, { key: ' ', code: 'Space' })
    expect(allItems().find((el) => el.getAttribute('data-id') === 'align-left')!.getAttribute('aria-checked')).toBe('false')
    expect(allItems().find((el) => el.getAttribute('data-id') === 'align-center')!.getAttribute('aria-checked')).toBe('true')
  })

  it('menuitemcheckbox Space 로 토글 + 메뉴 유지', () => {
    render(<Demo />)
    const format = tops().find((el) => el.getAttribute('data-id') === 'format')!
    fireEvent.click(format)
    const italic = allItems().find((el) => el.getAttribute('data-id') === 'italic')!
    italic.focus()
    fireEvent.keyDown(italic, { key: ' ', code: 'Space' })
    expect(allItems().find((el) => el.getAttribute('data-id') === 'italic')!.getAttribute('aria-checked')).toBe('true')
    expect(format.getAttribute('aria-expanded')).toBe('true')
  })

  it('마우스 클릭으로 checkbox 토글', () => {
    render(<Demo />)
    const format = tops().find((el) => el.getAttribute('data-id') === 'format')!
    fireEvent.click(format)
    const underline = allItems().find((el) => el.getAttribute('data-id') === 'underline')!
    fireEvent.click(underline)
    expect(allItems().find((el) => el.getAttribute('data-id') === 'underline')!.getAttribute('aria-checked')).toBe('true')
  })

  it('Escape 로 submenu 닫힘', () => {
    render(<Demo />)
    const format = tops().find((el) => el.getAttribute('data-id') === 'format')!
    fireEvent.click(format)
    const bold = allItems().find((el) => el.getAttribute('data-id') === 'bold')!
    bold.focus()
    fireEvent.keyDown(bold, { key: 'Escape' })
    expect(format.getAttribute('aria-expanded')).toBe('false')
  })

  it('nested submenu 렌더 — View > Zoom > Zoom in', () => {
    render(<Demo />)
    const view = tops().find((el) => el.getAttribute('data-id') === 'view')!
    fireEvent.click(view)
    const zoom = allItems().find((el) => el.getAttribute('data-id') === 'zoom')!
    zoom.focus()
    fireEvent.keyDown(zoom, { key: 'ArrowRight' })
    expect(zoom.getAttribute('aria-expanded')).toBe('true')
    expect(allItems().find((el) => el.getAttribute('data-id') === 'zoom-in')).toBeTruthy()
  })

  it('top 사이 ArrowRight 로 wrap 이동', () => {
    render(<Demo />)
    const list = tops()
    list[0].focus()
    fireEvent.keyDown(list[0], { key: 'ArrowRight' })
    expect(document.activeElement).toBe(list[1])
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

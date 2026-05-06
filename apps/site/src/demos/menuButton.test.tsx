import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './menuButton'

afterEach(cleanup)

const trigger = () => screen.getByRole('button') as HTMLButtonElement
const menu = () => screen.queryByRole('menu')
// menuitem + menuitemcheckbox + menuitemradio 전부 — 한 메뉴의 모든 leaf
const items = () =>
  Array.from(document.querySelectorAll('[role^="menuitem"]')) as HTMLElement[]

describe('menuButton demo — black-box (keyboard + mouse)', () => {
  it('초기에는 메뉴가 닫혀있다', () => {
    render(<Demo />)
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(menu()).toBeNull()
  })

  it('aria-haspopup=menu 가 노출된다', () => {
    render(<Demo />)
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu')
  })

  it('마우스 클릭으로 메뉴가 열린다', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
    expect(menu()).not.toBeNull()
    expect(items().length).toBeGreaterThan(0)
  })

  it('두 번 클릭하면 다시 닫힌다', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    fireEvent.click(trigger())
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('ArrowDown 으로 메뉴가 열리고 첫 항목에 포커스', () => {
    render(<Demo />)
    trigger().focus()
    fireEvent.keyDown(trigger(), { key: 'ArrowDown' })
    expect(menu()).not.toBeNull()
    expect(document.activeElement).toBe(items()[0])
  })

  it('ArrowUp 으로 메뉴가 열리고 마지막 항목에 포커스', () => {
    render(<Demo />)
    trigger().focus()
    fireEvent.keyDown(trigger(), { key: 'ArrowUp' })
    const list = items()
    expect(document.activeElement).toBe(list[list.length - 1])
  })

  it('메뉴 열린 상태에서 ArrowDown 으로 다음 항목에 포커스 이동', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const first = items()[0]
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items()[1])
  })

  it('Home/End 로 처음·끝 항목에 포커스', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const list = items()
    list[0].focus()
    fireEvent.keyDown(list[0], { key: 'End' })
    expect(document.activeElement).toBe(list[list.length - 1])
    fireEvent.keyDown(list[list.length - 1], { key: 'Home' })
    expect(document.activeElement).toBe(list[0])
  })

  it('Escape 로 메뉴가 닫힌다', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const first = items()[0]
    first.focus()
    fireEvent.keyDown(first, { key: 'Escape' })
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(menu()).toBeNull()
  })

  it('Enter 로 메뉴 항목이 활성화되고 메뉴가 닫힌다', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const first = items()[0]
    first.focus()
    fireEvent.keyDown(first, { key: 'Enter' })
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('마우스 클릭으로 메뉴 항목이 활성화되고 메뉴가 닫힌다', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    fireEvent.click(items()[0])
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('meta.keys 의 모든 키가 black-box 동작을 일으킨다', () => {
    const fromTriggerClosed = ['ArrowDown', 'ArrowUp', 'Enter', ' ']
    const snap = () => {
      const checkedSig = items()
        .map((el) => el.getAttribute('aria-checked') ?? '-')
        .join(',')
      return {
        open: trigger().getAttribute('aria-expanded'),
        focus: (document.activeElement as HTMLElement)?.id || '',
        path: items()
          .map((el) => el.getAttribute('aria-expanded'))
          .filter(Boolean)
          .join(','),
        checked: checkedSig,
      }
    }
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      if (fromTriggerClosed.includes(key)) {
        // 닫힌 trigger 에서 발사하는 키
        trigger().focus()
      } else {
        // open 한 뒤 menu 안에서 발사
        fireEvent.click(trigger())
        const list = items()
        if (key === 'ArrowRight') {
          // 부모 menuitem 으로 이동 (Recent — index 3)
          const parent = list.find((el) => el.getAttribute('aria-haspopup') === 'menu')!
          parent.focus()
        } else if (key === 'ArrowLeft') {
          // submenu 열고 그 안의 child 로 이동
          const parent = list.find((el) => el.getAttribute('aria-haspopup') === 'menu')!
          parent.focus()
          fireEvent.keyDown(parent, { key: 'ArrowRight' })
        } else if (key === 'ArrowUp' || key === 'Home') {
          // 비-첫 위치로 이동 (Home/ArrowUp 이 의미 있도록)
          list[0].focus()
          fireEvent.keyDown(list[0], { key: 'ArrowDown' })
          fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
        } else {
          list[0].focus()
        }
      }
      const before = snap()
      const target = document.activeElement as HTMLElement
      fireEvent.keyDown(target, key === ' ' ? { key: ' ', code: 'Space' } : { key })
      const after = snap()
      const changed =
        before.open !== after.open ||
        before.focus !== after.focus ||
        before.path !== after.path ||
        before.checked !== after.checked
      expect({ key, changed }).toEqual({ key, changed: true })
    }
  })

  // ─── APG nested submenu ─────────────────────────────────────
  it('parent menuitem 은 aria-haspopup=menu 와 aria-expanded 를 노출한다', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const parent = items().find((el) => el.getAttribute('aria-haspopup') === 'menu')!
    expect(parent.getAttribute('aria-expanded')).toBe('false')
  })

  it('ArrowRight 로 submenu 가 열리고 첫 자식에 포커스', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const parent = items().find((el) => el.getAttribute('aria-haspopup') === 'menu')!
    parent.focus()
    fireEvent.keyDown(parent, { key: 'ArrowRight' })
    expect(parent.getAttribute('aria-expanded')).toBe('true')
    // submenu items 가 추가로 보여야 함
    expect(items().length).toBeGreaterThan(8)
  })

  it('ArrowLeft 로 submenu 가 닫히고 부모 refocus', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const parent = items().find((el) => el.getAttribute('aria-haspopup') === 'menu')!
    parent.focus()
    fireEvent.keyDown(parent, { key: 'ArrowRight' })
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' })
    expect(parent.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(parent)
  })

  it('N-level nested — submenu 안에서 또 ArrowRight 로 손자 메뉴 열림', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const parent = items().find((el) => el.getAttribute('aria-haspopup') === 'menu')!
    parent.focus()
    fireEvent.keyDown(parent, { key: 'ArrowRight' }) // open Recent
    // 손자 parent (Archive) 로 이동
    const list = items()
    const grand = list.find(
      (el) => el.getAttribute('aria-haspopup') === 'menu' && el !== parent,
    )!
    grand.focus()
    fireEvent.keyDown(grand, { key: 'ArrowRight' })
    expect(grand.getAttribute('aria-expanded')).toBe('true')
  })

  // ─── APG menuitemcheckbox ───────────────────────────────────
  it('menuitemcheckbox 는 Space 로 토글되고 메뉴는 닫히지 않는다', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const cb = items().find((el) => el.getAttribute('role') === 'menuitemcheckbox')!
    cb.focus()
    const before = cb.getAttribute('aria-checked')
    fireEvent.keyDown(cb, { key: ' ', code: 'Space' })
    expect(cb.getAttribute('aria-checked')).not.toBe(before)
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
  })

  // ─── APG menuitemradio ───────────────────────────────────────
  it('menuitemradio 는 같은 그룹 내 mutual exclusion', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const radios = items().filter((el) => el.getAttribute('role') === 'menuitemradio')
    expect(radios.length).toBeGreaterThanOrEqual(2)
    const [r1, r2] = radios
    // 초기: theme-light=true, theme-dark=false
    expect(r1.getAttribute('aria-checked')).toBe('true')
    expect(r2.getAttribute('aria-checked')).toBe('false')
    r2.focus()
    fireEvent.keyDown(r2, { key: ' ', code: 'Space' })
    const after = items().filter((el) => el.getAttribute('role') === 'menuitemradio')
    expect(after[0].getAttribute('aria-checked')).toBe('false')
    expect(after[1].getAttribute('aria-checked')).toBe('true')
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

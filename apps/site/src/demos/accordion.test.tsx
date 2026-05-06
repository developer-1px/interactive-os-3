import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './accordion'

afterEach(cleanup)

const triggers = () => screen.getAllByRole('button') as HTMLButtonElement[]
const expanded = (el: Element) => el.getAttribute('aria-expanded') === 'true'

describe('accordion demo — black-box (keyboard + mouse)', () => {
  it('초기에 모든 패널은 닫혀있다', () => {
    render(<Demo />)
    for (const t of triggers()) expect(expanded(t)).toBe(false)
  })

  it('마우스 클릭으로 패널이 열린다', () => {
    render(<Demo />)
    fireEvent.click(triggers()[0])
    expect(expanded(triggers()[0])).toBe(true)
  })

  it('같은 트리거 두 번 클릭하면 다시 닫힌다', () => {
    render(<Demo />)
    fireEvent.click(triggers()[0])
    fireEvent.click(triggers()[0])
    expect(expanded(triggers()[0])).toBe(false)
  })

  it('multiple 모드 — 여러 패널이 동시에 열린다', () => {
    render(<Demo />)
    fireEvent.click(triggers()[0])
    fireEvent.click(triggers()[1])
    expect(expanded(triggers()[0])).toBe(true)
    expect(expanded(triggers()[1])).toBe(true)
  })

  it('ArrowDown 으로 다음 트리거에 포커스가 이동한다', () => {
    render(<Demo />)
    const [a, b] = triggers()
    a.focus()
    fireEvent.keyDown(a, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(b)
  })

  it('ArrowUp 으로 이전 트리거에 포커스가 이동한다', () => {
    render(<Demo />)
    const [a, b] = triggers()
    a.focus()
    fireEvent.keyDown(a, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(b)
    fireEvent.keyDown(b, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(a)
  })

  it('End 로 마지막 트리거, Home 으로 첫 트리거에 포커스가 이동한다', () => {
    render(<Demo />)
    const list = triggers()
    const first = list[0]
    const last = list[list.length - 1]
    first.focus()
    fireEvent.keyDown(first, { key: 'End' })
    expect(document.activeElement).toBe(last)
    fireEvent.keyDown(last, { key: 'Home' })
    expect(document.activeElement).toBe(first)
  })

  it('aria-controls 가 region id 와 연결돼 있다', () => {
    render(<Demo />)
    const t = triggers()[0]
    expect(document.getElementById(t.getAttribute('aria-controls')!)).not.toBeNull()
  })

  it('Enter 로 포커스된 패널을 토글한다', () => {
    render(<Demo />)
    const [a] = triggers()
    a.focus()
    fireEvent.keyDown(a, { key: 'Enter' })
    expect(expanded(triggers()[0])).toBe(true)
    fireEvent.keyDown(a, { key: 'Enter' })
    expect(expanded(triggers()[0])).toBe(false)
  })

  it('Space 로 포커스된 패널을 토글한다', () => {
    render(<Demo />)
    const [a] = triggers()
    a.focus()
    fireEvent.keyDown(a, { key: ' ' })
    expect(expanded(triggers()[0])).toBe(true)
  })

  it('meta.keys 의 모든 키가 black-box 동작을 일으킨다', () => {
    const snapshot = () => ({
      focus: (document.activeElement as HTMLElement)?.id,
      expanded: triggers().map((b) => b.getAttribute('aria-expanded')).join(','),
    })
    const startsFromLast = ['Home', 'ArrowUp', 'ArrowLeft']
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      const list = triggers()
      list[0].focus()
      if (startsFromLast.includes(key)) fireEvent.keyDown(document.activeElement!, { key: 'End' })
      const before = snapshot()
      const target = document.activeElement as HTMLElement
      if (key === 'Click' || key === ' ') fireEvent.click(target)
      else fireEvent.keyDown(target, { key })
      const changed =
        before.focus !== snapshot().focus || before.expanded !== snapshot().expanded
      expect({ key, changed }).toEqual({ key, changed: true })
    }
  })

  it('meta.keys 가 카탈로그에 노출된다', () => {
    render(
      <>
        <ul>{meta.keys!().map((k) => <li key={k}>{k}</li>)}</ul>
        <Demo />
      </>,
    )
    expect(screen.getByText('Enter')).toBeTruthy()
    expect(screen.getByText('ArrowDown')).toBeTruthy()
  })

  it('패널이 열리면 region 의 hidden 속성이 사라진다', () => {
    render(<Demo />)
    fireEvent.click(triggers()[0])
    const region = document.getElementById(triggers()[0].getAttribute('aria-controls')!)!
    expect(region.hasAttribute('hidden')).toBe(false)
  })
})

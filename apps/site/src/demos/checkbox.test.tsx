import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './checkbox'

afterEach(cleanup)

const box = () => screen.getByRole('checkbox') as HTMLButtonElement
const checked = (el: Element) => el.getAttribute('aria-checked')

describe('checkbox demo — black-box (keyboard + mouse)', () => {
  it('초기 상태는 unchecked 다', () => {
    render(<Demo />)
    expect(checked(box())).toBe('false')
  })

  it('마우스 클릭으로 checked 가 된다', () => {
    render(<Demo />)
    fireEvent.click(box())
    expect(checked(box())).toBe('true')
  })

  it('두 번 클릭하면 다시 unchecked 가 된다', () => {
    render(<Demo />)
    fireEvent.click(box())
    fireEvent.click(box())
    expect(checked(box())).toBe('false')
  })

  it('Space 로 토글된다', () => {
    render(<Demo />)
    box().focus()
    fireEvent.keyDown(box(), { key: ' ' })
    expect(checked(box())).toBe('true')
    fireEvent.keyDown(box(), { key: ' ' })
    expect(checked(box())).toBe('false')
  })

  it('Enter 로는 토글되지 않는다 (APG checkbox spec — Space only)', () => {
    render(<Demo />)
    box().focus()
    fireEvent.keyDown(box(), { key: 'Enter' })
    expect(checked(box())).toBe('false')
  })

  it('체크 시 ✓ 마크가 보인다', () => {
    render(<Demo />)
    fireEvent.click(box())
    expect(box().textContent).toBe('✓')
  })

  it('meta.keys 의 모든 키가 black-box 동작을 일으킨다', () => {
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      box().focus()
      const before = checked(box())
      if (key === 'Click' || key === ' ') fireEvent.click(box())
      else fireEvent.keyDown(box(), { key })
      const changed = before !== checked(box())
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

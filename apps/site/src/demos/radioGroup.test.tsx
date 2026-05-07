import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './radioGroup'

afterEach(cleanup)

const group = () => screen.getByRole('radiogroup') as HTMLElement
const radios = () => screen.getAllByRole('radio') as HTMLElement[]
const focused = () => radios().find((r) => r.tabIndex === 0)!
const checked = () => radios().filter((r) => r.getAttribute('aria-checked') === 'true')

// NOTE: 현 demo 는 reduceWithRadio 사용 — sff 가 emit 하는 'select' 를 reducer 가 흡수하지 않아
// 키보드 navigate 는 focus 만 이동, selection 은 클릭(activate)/Space 에서만 변한다.
// 본 테스트는 demo 의 "현재" 동작을 박제 — 추후 sff 를 활성화하면 expectation 수정 필요.

describe('radioGroup demo — black-box (keyboard + mouse)', () => {
  it('초기 — Medium 이 checked', () => {
    render(<Demo />)
    expect(checked().length).toBe(1)
    expect(checked()[0].textContent).toContain('Medium')
  })

  it('radiogroup role + 3개 radio', () => {
    render(<Demo />)
    expect(group().getAttribute('role')).toBe('radiogroup')
    expect(radios().length).toBe(3)
  })

  it('마우스 클릭으로 다른 radio 선택', () => {
    render(<Demo />)
    fireEvent.click(radios()[0])
    expect(checked().length).toBe(1)
    expect(checked()[0].textContent).toContain('Small')
  })

  it('Space 로 focus 된 radio 가 selected 된다', () => {
    render(<Demo />)
    fireEvent.click(radios()[0])
    // focus 다음 radio 로 이동 후 Space
    fireEvent.keyDown(focused(), { key: 'ArrowDown' })
    fireEvent.keyDown(focused(), { key: ' ' })
    expect(checked()[0].textContent).toContain('Medium')
  })

  it('ArrowDown 으로 focus 가 다음 radio 로 이동한다', () => {
    render(<Demo />)
    fireEvent.click(radios()[0])
    expect(focused().textContent).toContain('Small')
    fireEvent.keyDown(focused(), { key: 'ArrowDown' })
    expect(focused().textContent).toContain('Medium')
  })

  it('ArrowUp 으로 focus 가 이전 radio 로 이동한다', () => {
    render(<Demo />)
    fireEvent.click(radios()[0])
    fireEvent.keyDown(focused(), { key: 'End' })
    expect(focused().textContent).toContain('Large')
    fireEvent.keyDown(focused(), { key: 'ArrowUp' })
    expect(focused().textContent).toContain('Medium')
  })

  it('ArrowRight 도 focus navigate (양 축 모두 활성)', () => {
    render(<Demo />)
    fireEvent.click(radios()[0])
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    expect(focused().textContent).toContain('Medium')
  })

  it('Home/End 로 첫/마지막 radio 로 focus 이동', () => {
    render(<Demo />)
    fireEvent.click(radios()[0])
    fireEvent.keyDown(focused(), { key: 'End' })
    expect(focused().textContent).toContain('Large')
    fireEvent.keyDown(focused(), { key: 'Home' })
    expect(focused().textContent).toContain('Small')
  })

  it('aria-orientation=vertical', () => {
    render(<Demo />)
    expect(group().getAttribute('aria-orientation')).toBe('vertical')
  })

  it('meta.keys 의 모든 키가 black-box 동작을 일으킨다 (focus 또는 checked)', () => {
    const snap = () => ({
      checked: radios().map((r) => r.getAttribute('aria-checked')).join(','),
      focusLabel: focused()?.textContent ?? '',
    })
    const startsFromLast = ['Home', 'ArrowUp', 'ArrowLeft', 'PageUp']
    for (const key of meta.keys!()) {
      cleanup()
      render(<Demo />)
      // 시작점: Small checked + Medium focused (검사 키가 변화를 일으킬 여지 확보).
      fireEvent.click(radios()[0])
      fireEvent.keyDown(focused(), { key: 'ArrowDown' })
      if (startsFromLast.includes(key)) fireEvent.keyDown(focused(), { key: 'End' })
      const before = snap()
      if (key === 'Click') fireEvent.click(radios()[2])
      else fireEvent.keyDown(focused(), { key })
      const after = snap()
      const changed = before.checked !== after.checked || before.focusLabel !== after.focusLabel
      expect({ key, changed }).toEqual({ key, changed: true })
    }
  })
})

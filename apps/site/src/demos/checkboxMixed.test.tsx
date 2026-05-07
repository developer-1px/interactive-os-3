import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo from './checkboxMixed'

afterEach(cleanup)

const checkboxes = () => screen.getAllByRole('checkbox') as HTMLElement[]
const parent = () => checkboxes()[0]
const children = () => checkboxes().slice(1)
const checkedOf = (el: HTMLElement) => el.getAttribute('aria-checked')

describe('checkboxMixed demo — black-box (keyboard + mouse)', () => {
  it('group + parent + 4개 child checkbox', () => {
    render(<Demo />)
    expect(screen.getByRole('group').getAttribute('aria-label')).toBe('Sandwich toppings')
    expect(checkboxes().length).toBe(5)
  })

  it('초기 — Lettuce 만 checked, parent 는 mixed', () => {
    render(<Demo />)
    expect(checkedOf(children()[0])).toBe('true')
    expect(checkedOf(children()[1])).toBe('false')
    expect(checkedOf(parent())).toBe('mixed')
  })

  it('parent 클릭으로 모두 checked (mixed → true)', () => {
    render(<Demo />)
    fireEvent.click(parent())
    expect(checkedOf(parent())).toBe('true')
    for (const c of children()) expect(checkedOf(c)).toBe('true')
  })

  it('all-checked 상태에서 parent 클릭하면 모두 unchecked', () => {
    render(<Demo />)
    fireEvent.click(parent())
    fireEvent.click(parent())
    expect(checkedOf(parent())).toBe('false')
    for (const c of children()) expect(checkedOf(c)).toBe('false')
  })

  it('child 모두 체크 시 parent=true 자동 derive', () => {
    render(<Demo />)
    fireEvent.click(children()[1])
    fireEvent.click(children()[2])
    fireEvent.click(children()[3])
    expect(checkedOf(parent())).toBe('true')
  })

  it('모든 child 체크 해제 시 parent=false', () => {
    render(<Demo />)
    fireEvent.click(children()[0])
    expect(checkedOf(parent())).toBe('false')
  })

  it('child Space 로 토글', () => {
    render(<Demo />)
    fireEvent.keyDown(children()[1], { key: ' ' })
    expect(checkedOf(children()[1])).toBe('true')
  })
})

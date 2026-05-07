import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './dialog'

afterEach(cleanup)

const trigger = () => screen.getByRole('button', { name: /Open dialog/i }) as HTMLButtonElement
const dialogEl = () => screen.queryByRole('dialog') as HTMLElement | null

describe('dialog demo — black-box (keyboard + mouse)', () => {
  it('초기 — dialog 닫혀있다', () => {
    render(<Demo />)
    expect(dialogEl()).toBeNull()
  })

  it('Open dialog 클릭으로 dialog 열림', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    expect(dialogEl()).not.toBeNull()
    expect(dialogEl()!.getAttribute('aria-modal')).toBe('true')
  })

  it('aria-label 노출', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    expect(dialogEl()!.getAttribute('aria-label')).toBe('Confirm action')
  })

  it('Escape 로 dialog 닫힘', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    fireEvent.keyDown(dialogEl()!, { key: 'Escape' })
    expect(dialogEl()).toBeNull()
  })

  it('Cancel 버튼 클릭으로 dialog 닫힘', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(dialogEl()).toBeNull()
  })

  it('Confirm 버튼 클릭으로 dialog 닫힘', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(dialogEl()).toBeNull()
  })

  it('dialog role 노출', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    expect(dialogEl()!.getAttribute('role')).toBe('dialog')
  })

  it('meta.keys (Escape) 가 dialog 를 닫는다', () => {
    // Tab 은 focus trap 용 — dialog open 상태를 변화시키지 않음.
    const closeKeys = meta.keys!().filter((k) => !['Tab'].includes(k))
    for (const key of closeKeys) {
      cleanup()
      render(<Demo />)
      fireEvent.click(trigger())
      const before = dialogEl() !== null
      fireEvent.keyDown(dialogEl()!, { key })
      const after = dialogEl() !== null
      expect({ key, changed: before !== after }).toEqual({ key, changed: true })
    }
  })
})

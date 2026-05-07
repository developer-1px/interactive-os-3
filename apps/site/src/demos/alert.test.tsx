import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo from './alert'

afterEach(cleanup)

const trigger = () => screen.getByRole('button', { name: 'Trigger alert' })

describe('alert demo — black-box', () => {
  it('초기 — alert 미표시', () => {
    render(<Demo />)
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('Trigger 클릭으로 alert 노출 (role=alert)', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    const alert = screen.getByRole('alert')
    expect(alert.textContent).toContain('Alert #1')
  })

  it('여러 번 클릭하면 카운트 증가', () => {
    render(<Demo />)
    fireEvent.click(trigger())
    fireEvent.click(trigger())
    fireEvent.click(trigger())
    expect(screen.getByRole('alert').textContent).toContain('Alert #3')
  })
})

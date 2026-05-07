import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import Demo from './table'

afterEach(cleanup)

describe('table demo — black-box', () => {
  it('table role + caption Employees', () => {
    render(<Demo />)
    expect(screen.getByRole('table')).toBeTruthy()
    expect(screen.getByText('Employees')).toBeTruthy()
  })

  it('columnheader 3개 (Name / Role / Department)', () => {
    render(<Demo />)
    const cols = screen.getAllByRole('columnheader')
    expect(cols.length).toBe(3)
    expect(cols.map((c) => c.textContent)).toEqual(['Name', 'Role', 'Department'])
  })

  it('각 columnheader 의 scope=col', () => {
    render(<Demo />)
    for (const c of screen.getAllByRole('columnheader')) {
      expect(c.getAttribute('scope')).toBe('col')
    }
  })

  it('row 5개 (header 1 + body 4)', () => {
    render(<Demo />)
    expect(screen.getAllByRole('row').length).toBe(5)
  })

  it('cell 12개 (4 row × 3 col)', () => {
    render(<Demo />)
    expect(screen.getAllByRole('cell').length).toBe(12)
  })

  it('내용 — Ada Lovelace / Engineer / Platform 노출', () => {
    render(<Demo />)
    expect(screen.getByText('Ada Lovelace')).toBeTruthy()
    expect(screen.getByText('Linus Torvalds')).toBeTruthy()
    expect(screen.getByText('Compilers')).toBeTruthy()
  })
})

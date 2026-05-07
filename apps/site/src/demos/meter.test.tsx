import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import Demo from './meter'

afterEach(cleanup)

// native <meter> 도 role=meter — div[role=meter] 만 추림.
const meters = () => (screen.getAllByRole('meter') as HTMLElement[]).filter((m) => m.tagName === 'DIV')
const allMeters = () => screen.getAllByRole('meter') as HTMLElement[]

describe('meter demo — black-box', () => {
  it('role=meter 가 4개 (native 2 + role 2)', () => {
    render(<Demo />)
    expect(allMeters().length).toBe(4)
    expect(meters().length).toBe(2)
  })

  it('각 meter aria-valuemin/max/now 노출', () => {
    render(<Demo />)
    const m = meters()
    expect(m[0].getAttribute('aria-valuemin')).toBe('0')
    expect(m[0].getAttribute('aria-valuemax')).toBe('100')
    expect(m[0].getAttribute('aria-valuenow')).toBe('70')
    expect(m[1].getAttribute('aria-valuemax')).toBe('5000')
    expect(m[1].getAttribute('aria-valuenow')).toBe('4200')
  })

  it('aria-valuetext 가 의미 있는 표현', () => {
    render(<Demo />)
    expect(meters()[0].getAttribute('aria-valuetext')).toContain('%')
    expect(meters()[1].getAttribute('aria-valuetext')).toContain('USD')
  })

  it('각 meter aria-labelledby 가 dt 와 매칭', () => {
    render(<Demo />)
    for (const m of meters()) {
      const id = m.getAttribute('aria-labelledby')!
      expect(document.getElementById(id)).not.toBeNull()
    }
  })

  it('Disk usage / Budget spent 라벨 표기', () => {
    render(<Demo />)
    expect(screen.getAllByText('Disk usage').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Budget spent').length).toBeGreaterThan(0)
  })
})

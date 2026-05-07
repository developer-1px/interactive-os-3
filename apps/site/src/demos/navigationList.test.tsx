import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo from './navigationList'

afterEach(cleanup)

const links = () => screen.getAllByRole('link') as HTMLAnchorElement[]
const current = () => links().find((l) => l.getAttribute('aria-current') === 'page')!

describe('navigationList demo — black-box', () => {
  it('navigation role + aria-label', () => {
    render(<Demo />)
    const nav = screen.getByRole('navigation')
    expect(nav.getAttribute('aria-label')).toBe('Primary')
  })

  it('4개 link + 초기 current=Docs', () => {
    render(<Demo />)
    expect(links().length).toBe(4)
    expect(current().textContent).toBe('Docs')
  })

  it('각 link 의 href 가 노출', () => {
    render(<Demo />)
    expect(links()[0].getAttribute('href')).toBe('#home')
    expect(links()[3].getAttribute('href')).toBe('#guides')
  })

  it('마우스 클릭으로 current 가 이동한다 (singleCurrent)', () => {
    render(<Demo />)
    fireEvent.click(links()[0])
    expect(current().textContent).toBe('Home')
  })

  it('한 시점에 정확히 1개의 aria-current', () => {
    render(<Demo />)
    fireEvent.click(links()[2])
    expect(links().filter((l) => l.getAttribute('aria-current') === 'page').length).toBe(1)
    expect(current().textContent).toBe('Api')
  })
})

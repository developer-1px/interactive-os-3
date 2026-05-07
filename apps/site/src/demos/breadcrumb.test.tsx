import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import Demo from './breadcrumb'

afterEach(cleanup)

describe('breadcrumb demo — black-box', () => {
  it('nav 에 aria-label="Breadcrumb"', () => {
    render(<Demo />)
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('Breadcrumb')
  })

  it('ol 안에 4개의 trail 노출', () => {
    render(<Demo />)
    expect(screen.getByText('Home')).toBeTruthy()
    expect(screen.getByText('Documentation')).toBeTruthy()
    expect(screen.getByText('Patterns')).toBeTruthy()
    expect(screen.getByText('Breadcrumb')).toBeTruthy()
  })

  it('마지막 항목은 aria-current="page" + link 가 아닌 span', () => {
    render(<Demo />)
    const last = screen.getByText('Breadcrumb')
    expect(last.getAttribute('aria-current')).toBe('page')
    expect(last.tagName).toBe('SPAN')
  })

  it('나머지는 anchor + href', () => {
    render(<Demo />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBe(3)
    expect(links[0].getAttribute('href')).toBe('#home')
    expect(links[2].getAttribute('href')).toBe('#patterns')
  })

  it('separator 는 aria-hidden', () => {
    render(<Demo />)
    const seps = screen.getAllByText('/')
    for (const s of seps) expect(s.getAttribute('aria-hidden')).toBe('true')
  })
})

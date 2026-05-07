import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo from './sidebarGrouped'

afterEach(cleanup)

const list = () => screen.getByRole('listbox') as HTMLElement
const options = () => screen.getAllByRole('option') as HTMLElement[]
const focused = () => options().find((o) => o.tabIndex === 0)!
const selected = () => options().filter((o) => o.getAttribute('aria-selected') === 'true')

describe('sidebarGrouped demo — black-box (keyboard + mouse)', () => {
  it('listbox + 7개 option', () => {
    render(<Demo />)
    expect(list().getAttribute('aria-label')).toBe('Mailboxes')
    expect(options().length).toBe(7)
  })

  it('group 헤더 (Recently / Folders / Tags) 노출', () => {
    render(<Demo />)
    expect(screen.getByText('Recently')).toBeTruthy()
    expect(screen.getByText('Folders')).toBeTruthy()
    expect(screen.getByText('Tags')).toBeTruthy()
  })

  it('마우스 클릭으로 option 이 selected', () => {
    render(<Demo />)
    fireEvent.click(options()[3])
    expect(selected()[0].textContent).toContain('Work')
  })

  it('ArrowDown 으로 다음 option 이 selected (sff)', () => {
    render(<Demo />)
    fireEvent.click(options()[0])
    fireEvent.keyDown(focused(), { key: 'ArrowDown' })
    expect(selected()[0].textContent).toContain('Starred')
  })

  it('Cmd+1 로 첫 option(Inbox) activate', () => {
    render(<Demo />)
    fireEvent.keyDown(list(), { key: '1', metaKey: true })
    expect(selected()[0].textContent).toContain('Inbox')
  })

  it('Ctrl+4 로 4번째 option(Work) activate', () => {
    render(<Demo />)
    fireEvent.keyDown(list(), { key: '4', ctrlKey: true })
    expect(selected()[0].textContent).toContain('Work')
  })

  it('첫 9개 option 에 ⌘N 단축키 표기', () => {
    render(<Demo />)
    expect(screen.getByText('⌘1')).toBeTruthy()
    expect(screen.getByText('⌘7')).toBeTruthy()
  })
})

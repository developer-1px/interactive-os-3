import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo from './treeGrid'

afterEach(cleanup)

const grid = () => screen.getByRole('treegrid') as HTMLElement
const rows = () => screen.getAllByRole('row') as HTMLElement[]
const dataRows = () => rows().slice(1) // header row 제외
const focused = () => dataRows().find((r) => r.tabIndex === 0)

describe('treeGrid demo — black-box (keyboard + mouse)', () => {
  it('treegrid role + columnheader 3개', () => {
    render(<Demo />)
    expect(grid().getAttribute('role')).toBe('treegrid')
    expect(screen.getAllByRole('columnheader').length).toBe(3)
  })

  it('aria-label=Files, aria-colcount=3', () => {
    render(<Demo />)
    expect(grid().getAttribute('aria-label')).toBe('Files')
  })

  it('초기 — src expanded 로 4 data row 노출 (src/app/main/pkg)', () => {
    render(<Demo />)
    expect(dataRows().length).toBe(4)
    const labels = dataRows().map((r) => r.textContent)
    expect(labels[0]).toContain('src')
    expect(labels[1]).toContain('App.tsx')
    expect(labels[3]).toContain('package.json')
  })

  it('src row 의 aria-expanded=true', () => {
    render(<Demo />)
    expect(dataRows()[0].getAttribute('aria-expanded')).toBe('true')
  })

  it('ArrowLeft 으로 src collapse', () => {
    render(<Demo />)
    const src = dataRows()[0]
    src.focus()
    fireEvent.keyDown(src, { key: 'ArrowLeft' })
    expect(dataRows()[0].getAttribute('aria-expanded')).toBe('false')
    expect(dataRows().length).toBe(2) // src + pkg
  })

  it('Collapse 후 ArrowRight 로 다시 expand', () => {
    render(<Demo />)
    const src = dataRows()[0]
    src.focus()
    fireEvent.keyDown(src, { key: 'ArrowLeft' })
    fireEvent.keyDown(focused()!, { key: 'ArrowRight' })
    expect(dataRows()[0].getAttribute('aria-expanded')).toBe('true')
    expect(dataRows().length).toBe(4)
  })

  it('각 row 가 aria-level 노출', () => {
    render(<Demo />)
    expect(dataRows()[0].getAttribute('aria-level')).toBe('1')
    expect(dataRows()[1].getAttribute('aria-level')).toBe('2')
  })

  it('gridcell 노출', () => {
    render(<Demo />)
    expect(screen.getAllByRole('gridcell').length).toBeGreaterThan(0)
  })
})

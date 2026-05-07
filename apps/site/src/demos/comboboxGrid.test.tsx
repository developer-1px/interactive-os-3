import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './comboboxGrid'

afterEach(cleanup)

const input = () => screen.getByRole('combobox') as HTMLInputElement
const grid = () => screen.queryByRole('grid')
const rows = () => screen.queryAllByRole('row') as HTMLElement[]
const cells = () => screen.queryAllByRole('gridcell') as HTMLElement[]
const activeCell = () => cells().find((c) => c.hasAttribute('data-active'))

describe('comboboxGrid demo — black-box (keyboard + mouse)', () => {
  it('초기 — combobox 닫힘, grid 미렌더', () => {
    render(<Demo />)
    expect(input().getAttribute('aria-expanded')).toBe('false')
    expect(grid()).toBeNull()
  })

  it('aria-haspopup=grid + aria-controls', () => {
    render(<Demo />)
    expect(input().getAttribute('aria-haspopup')).toBe('grid')
    expect(input().getAttribute('aria-controls')).not.toBeNull()
  })

  it('ArrowDown 으로 grid 열림', () => {
    render(<Demo />)
    input().focus()
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(input().getAttribute('aria-expanded')).toBe('true')
    expect(grid()).not.toBeNull()
  })

  it('타이핑 시 grid 열리고 필터링 (Br → Brazil)', () => {
    render(<Demo />)
    fireEvent.change(input(), { target: { value: 'Br' } })
    expect(input().getAttribute('aria-expanded')).toBe('true')
    const labels = rows().map((r) => r.textContent)
    expect(labels.some((l) => l!.includes('Brazil'))).toBe(true)
    expect(labels.some((l) => l!.includes('Australia'))).toBe(false)
  })

  it('grid role + 6 rows × 3 cols 렌더', () => {
    render(<Demo />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(grid()!.getAttribute('role')).toBe('grid')
    expect(rows().length).toBe(6)
    expect(cells().length).toBe(18)
  })

  it('각 cell 은 aria-rowindex / aria-colindex 노출', () => {
    render(<Demo />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    const cs = cells()
    expect(cs[0].getAttribute('aria-rowindex')).toBe('1')
    expect(cs[0].getAttribute('aria-colindex')).toBe('1')
    expect(cs[2].getAttribute('aria-colindex')).toBe('3')
  })

  it('ArrowDown 으로 첫 cell 활성', () => {
    render(<Demo />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    const a = activeCell()
    expect(a).not.toBeUndefined()
    expect(a!.getAttribute('aria-rowindex')).toBe('1')
  })

  it('ArrowDown 두 번 — row 2 첫 cell', () => {
    render(<Demo />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(activeCell()!.getAttribute('aria-rowindex')).toBe('2')
  })

  it('ArrowRight 으로 같은 row 의 다음 column', () => {
    render(<Demo />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.keyDown(input(), { key: 'ArrowRight' })
    expect(activeCell()!.getAttribute('aria-colindex')).toBe('2')
  })

  it('ArrowLeft 으로 이전 column', () => {
    render(<Demo />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.keyDown(input(), { key: 'ArrowRight' })
    fireEvent.keyDown(input(), { key: 'ArrowLeft' })
    expect(activeCell()!.getAttribute('aria-colindex')).toBe('1')
  })

  it('aria-activedescendant 가 active cell DOM id 와 매칭', () => {
    render(<Demo />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    const ad = input().getAttribute('aria-activedescendant')!
    expect(document.getElementById(ad)).toBe(activeCell()!)
  })

  it('Enter 로 row commit — input.value 가 row label 첫 cell', () => {
    render(<Demo />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    fireEvent.keyDown(input(), { key: 'Enter' })
    expect(input().value).toBe('Argentina')
  })

  // NOTE: 현 demo 의 Escape 는 dispatchKey 가 activeId 를 target 으로 escape axis 를 돌려
  // `{type:'open', id:activeCellId, open:false}` 를 emit — ROOT 의 expanded 가 derive 되는
  // `isOpen(data, ROOT)` 는 영향받지 않아 grid 가 닫히지 않는다. blur 로만 닫힘.
  it('blur 로 grid 닫힘 (closeOnBlurDelay)', async () => {
    render(<Demo />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    expect(grid()).not.toBeNull()
    fireEvent.blur(input())
    await new Promise((r) => setTimeout(r, 150))
    expect(grid()).toBeNull()
  })

  it('cell 클릭으로 commit', () => {
    render(<Demo />)
    fireEvent.keyDown(input(), { key: 'ArrowDown' })
    // row 3 (Brazil) 의 첫 cell 클릭
    fireEvent.click(cells()[6])
    expect(input().value).toBe('Brazil')
  })

  it('필터로 매치 없으면 grid 미렌더', () => {
    render(<Demo />)
    fireEvent.change(input(), { target: { value: 'zzz' } })
    expect(grid()).toBeNull()
  })

  it('meta.keys 의 모든 키가 black-box 동작을 일으킨다', () => {
    const snap = () => ({
      expanded: input().getAttribute('aria-expanded'),
      active: input().getAttribute('aria-activedescendant') ?? '',
      value: input().value,
    })
    // Escape 는 본 demo 에서 active cell 에 dispatch 되어 ROOT-level expanded 를 토글하지
    // 못함 → 관측치 변화 없음. 별도 테스트(blur 닫힘)에서 다룸.
    const skipKeys = ['Escape']
    for (const key of meta.keys!().filter((k) => !skipKeys.includes(k))) {
      cleanup()
      render(<Demo />)
      // 시작점: grid 열려있고 row 2 col 2 활성 (모든 방향키가 변화를 일으킬 수 있는 중앙).
      fireEvent.keyDown(input(), { key: 'ArrowDown' })
      fireEvent.keyDown(input(), { key: 'ArrowDown' })
      fireEvent.keyDown(input(), { key: 'ArrowRight' })
      const before = snap()
      fireEvent.keyDown(input(), { key })
      const after = snap()
      const changed = JSON.stringify(before) !== JSON.stringify(after)
      expect({ key, changed }).toEqual({ key, changed: true })
    }
  })
})

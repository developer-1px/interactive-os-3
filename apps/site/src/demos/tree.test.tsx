import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Demo, { meta } from './tree'

afterEach(cleanup)

const items = () => screen.getAllByRole('treeitem') as HTMLElement[]
const byLabel = (label: string) =>
  items().find((el) => el.textContent?.includes(label))!
const expandedOf = (el: Element) => el.getAttribute('aria-expanded')
const expandedSnapshot = () =>
  items().map((el) => `${el.getAttribute('data-id')}:${expandedOf(el) ?? '-'}`).join(',')

describe('tree demo — black-box (keyboard + mouse)', () => {
  it('초기 렌더 — src/demos 펼침, 자식 노드 노출', () => {
    render(<Demo />)
    expect(byLabel('src')).toBeTruthy()
    expect(byLabel('App.tsx')).toBeTruthy()
    expect(byLabel('demos')).toBeTruthy()
    expect(byLabel('tabs.tsx')).toBeTruthy()
    expect(byLabel('package.json')).toBeTruthy()
  })

  it('aria-expanded 는 hasChildren 노드만 가진다', () => {
    render(<Demo />)
    expect(expandedOf(byLabel('src'))).toBe('true')
    expect(expandedOf(byLabel('demos'))).toBe('true')
    expect(expandedOf(byLabel('App.tsx'))).toBe(null)
    expect(expandedOf(byLabel('package.json'))).toBe(null)
  })

  it('aria-level / posinset / setsize 가 spec 대로 emit 된다', () => {
    render(<Demo />)
    const src = byLabel('src')
    expect(src.getAttribute('aria-level')).toBe('1')
    expect(src.getAttribute('aria-posinset')).toBe('1')
    expect(src.getAttribute('aria-setsize')).toBe('2')
    const tabs = byLabel('tabs.tsx')
    expect(tabs.getAttribute('aria-level')).toBe('3')
  })

  it('ArrowDown 으로 다음 visible treeitem 에 포커스가 이동한다 — expand 부수효과 없음', () => {
    render(<Demo />)
    const before = expandedSnapshot()
    const src = byLabel('src')
    src.focus()
    fireEvent.keyDown(src, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(byLabel('App.tsx'))
    expect(expandedSnapshot()).toBe(before)
  })

  it('ArrowUp 으로 이전 visible treeitem 에 포커스가 이동한다 — expand 부수효과 없음', () => {
    render(<Demo />)
    const src = byLabel('src')
    src.focus()
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    const before = expandedSnapshot()
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(byLabel('src'))
    expect(expandedSnapshot()).toBe(before)
  })

  it('ArrowDown/ArrowUp 반복 — 어떤 노드의 aria-expanded 도 바뀌지 않는다 (focus ≠ expand)', () => {
    render(<Demo />)
    const before = expandedSnapshot()
    const first = items()[0]
    first.focus()
    for (let i = 0; i < 6; i++) fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    for (let i = 0; i < 6; i++) fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
    expect(expandedSnapshot()).toBe(before)
  })

  it('ArrowRight on expanded node — 첫 자식으로 포커스 이동, expand 변화 없음', () => {
    render(<Demo />)
    const src = byLabel('src')
    src.focus()
    const before = expandedSnapshot()
    fireEvent.keyDown(src, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(byLabel('App.tsx'))
    expect(expandedSnapshot()).toBe(before)
  })

  // 키보드로 demos 노드까지 포커스 이동 (focusId roving state 권위)
  const focusDemos = () => {
    items()[0].focus()
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' }) // src → App.tsx
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' }) // → demos
  }

  it('ArrowLeft on expanded node — 노드를 collapse 한다', () => {
    render(<Demo />)
    focusDemos()
    expect(document.activeElement).toBe(byLabel('demos'))
    expect(expandedOf(byLabel('demos'))).toBe('true')
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' })
    expect(expandedOf(byLabel('demos'))).toBe('false')
    expect(items().some((el) => el.textContent?.includes('tabs.tsx'))).toBe(false)
  })

  it('ArrowRight on collapsed node — 노드를 expand 한다 (포커스 이동 없음)', () => {
    render(<Demo />)
    focusDemos()
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' })
    expect(expandedOf(byLabel('demos'))).toBe('false')
    expect(document.activeElement).toBe(byLabel('demos'))
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' })
    expect(expandedOf(byLabel('demos'))).toBe('true')
    expect(document.activeElement).toBe(byLabel('demos'))
  })

  it('ArrowLeft on collapsed node — 부모로 포커스 이동', () => {
    render(<Demo />)
    focusDemos()
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' }) // collapse demos
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' }) // → parent (src)
    expect(document.activeElement).toBe(byLabel('src'))
  })

  it('Home — 첫 visible 노드, End — 마지막 visible 노드', () => {
    render(<Demo />)
    const last = byLabel('package.json')
    items()[0].focus()
    fireEvent.keyDown(document.activeElement!, { key: 'End' })
    expect(document.activeElement).toBe(last)
    fireEvent.keyDown(document.activeElement!, { key: 'Home' })
    expect(document.activeElement).toBe(byLabel('src'))
  })

  it('클릭으로 노드를 선택한다 (selectionFollowsFocus)', () => {
    render(<Demo />)
    const app = byLabel('App.tsx')
    fireEvent.click(app)
    expect(byLabel('App.tsx').getAttribute('aria-selected')).toBe('true')
  })

  it('클릭 — 다른 노드를 선택하면 이전 선택은 해제된다 (single)', () => {
    render(<Demo />)
    fireEvent.click(byLabel('App.tsx'))
    fireEvent.click(byLabel('package.json'))
    expect(byLabel('App.tsx').getAttribute('aria-selected')).toBe('false')
    expect(byLabel('package.json').getAttribute('aria-selected')).toBe('true')
  })

  it('typeahead — 첫 글자로 매칭 노드에 포커스', () => {
    render(<Demo />)
    items()[0].focus()
    fireEvent.keyDown(document.activeElement!, { key: 'p' })
    expect(document.activeElement).toBe(byLabel('package.json'))
  })

  it('rootProps — role=tree + aria-orientation=vertical', () => {
    render(<Demo />)
    const root = screen.getByRole('tree')
    expect(root.getAttribute('aria-orientation')).toBe('vertical')
    expect(root.getAttribute('aria-label')).toBe('Files')
  })

  it('roving tabindex — 정확히 한 treeitem 만 tabIndex=0', () => {
    render(<Demo />)
    const tabbables = items().filter((el) => el.tabIndex === 0)
    expect(tabbables.length).toBe(1)
  })

  it('meta.keys 의 모든 키가 black-box 동작을 일으킨다', () => {
    const snapshot = () => ({
      focus: (document.activeElement as HTMLElement)?.getAttribute('data-id'),
      expanded: expandedSnapshot(),
      selected: items().map((el) => el.getAttribute('aria-selected')).join(','),
    })
    const startsFromLast = ['Home', 'ArrowUp']
    for (const key of meta.keys!()) {
      if (key.startsWith('<')) continue // typeahead synthetic sentinel — covered by 'p' typeahead test
      cleanup()
      render(<Demo />)
      items()[0].focus()
      if (startsFromLast.includes(key)) fireEvent.keyDown(document.activeElement!, { key: 'End' })
      const before = snapshot()
      const target = document.activeElement as HTMLElement
      if (key === 'Click') fireEvent.click(target)
      else fireEvent.keyDown(target, { key: key === ' ' ? ' ' : key })
      const after = snapshot()
      const changed =
        before.focus !== after.focus ||
        before.expanded !== after.expanded ||
        before.selected !== after.selected
      expect({ key, changed }).toEqual({ key, changed: true })
    }
  })
})

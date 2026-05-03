import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFeedPattern } from './feed'
import { fromTree } from '../state/fromTree'

const data = () =>
  fromTree(
    [
      { id: 'a1', label: 'Article 1' },
      { id: 'a2', label: 'Article 2' },
      { id: 'a3', label: 'Article 3' },
    ],
    { getId: (n) => n.id, toData: (n) => ({ label: n.label }) },
  )

describe('useFeedPattern', () => {
  it('rootProps: role=feed, aria-busy from opts', () => {
    const { result } = renderHook(() => useFeedPattern(data(), undefined, { busy: true }))
    expect(result.current.rootProps.role).toBe('feed')
    expect((result.current.rootProps as unknown as Record<string, unknown>)['aria-busy']).toBe(true)
    expect(result.current.rootProps.onKeyDown).toBeTypeOf('function')
  })

  it('rootProps: aria-busy omitted when false (truthy gate)', () => {
    const { result } = renderHook(() => useFeedPattern(data()))
    expect((result.current.rootProps as unknown as Record<string, unknown>)['aria-busy']).toBeUndefined()
  })

  it('articleProps: role=article, tabIndex=-1, aria-posinset/setsize, aria-labelledby', () => {
    const { result } = renderHook(() => useFeedPattern(data()))
    const a2 = result.current.articleProps('a2') as unknown as Record<string, unknown>
    expect(a2.role).toBe('article')
    expect(a2.tabIndex).toBe(-1)
    expect(a2['aria-posinset']).toBe(2)
    expect(a2['aria-setsize']).toBe(3)
    expect(a2['aria-labelledby']).toBe('feed-article-a2-label')
    expect(a2['data-feed-article']).toBe('')
    expect(a2['data-id']).toBe('a2')
  })

  it('labelProps: id matches articleProps aria-labelledby', () => {
    const { result } = renderHook(() => useFeedPattern(data()))
    const a1 = result.current.articleProps('a1') as unknown as Record<string, unknown>
    const labelId = (result.current.labelProps('a1') as { id: string }).id
    expect(a1['aria-labelledby']).toBe(labelId)
  })

  it('items expose posinset/setsize for all entries', () => {
    const { result } = renderHook(() => useFeedPattern(data()))
    expect(result.current.items.map((it) => [it.id, it.posinset, it.setsize])).toEqual([
      ['a1', 1, 3],
      ['a2', 2, 3],
      ['a3', 3, 3],
    ])
  })

  it('idPrefix custom override propagates to article + label ids', () => {
    const { result } = renderHook(() => useFeedPattern(data(), undefined, { idPrefix: 'news' }))
    const a1 = result.current.articleProps('a1') as unknown as Record<string, unknown>
    expect(a1.id).toBe('news-article-a1')
    expect(a1['aria-labelledby']).toBe('news-article-a1-label')
  })

  it('label / labelledBy opts → aria-label / aria-labelledby on root', () => {
    const { result: r1 } = renderHook(() => useFeedPattern(data(), undefined, { label: 'News feed' }))
    expect((r1.current.rootProps as unknown as Record<string, unknown>)['aria-label']).toBe('News feed')
    const { result: r2 } = renderHook(() => useFeedPattern(data(), undefined, { labelledBy: 'feed-h' }))
    expect((r2.current.rootProps as unknown as Record<string, unknown>)['aria-labelledby']).toBe('feed-h')
  })
})

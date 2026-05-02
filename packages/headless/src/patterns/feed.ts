import { useCallback, type KeyboardEvent } from 'react'
import { ROOT, getChildren, getLabel, type NormalizedData } from '../types'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface FeedOptions {
  /** aria-busy — DOM 갱신 중 true. */
  busy?: boolean
  /** Container entity for nested feeds; defaults to ROOT. */
  containerId?: string
  idPrefix?: string
  /** aria-label — ARIA: feed requires accessible name. */
  label?: string
  labelledBy?: string
}

const ARTICLE_ATTR = 'data-feed-article'

/**
 * feed — APG `/feed/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/feed/
 *
 * 구조 패턴 (위젯 아님). 각 article 은 focusable (tabIndex=-1) 이며
 * Page Up/Down 으로 article 단위 이동. focus 가 article 내부 상호작용 요소에 있어도
 * Page Up/Down 은 root keydown 에서 가로채 다음/이전 article 로 이동.
 *
 * Ctrl+Home/End (feed 바깥 first/last focusable 로 이동) 은 host 가
 * 자유롭게 구현. 본 recipe 는 feed 안 nav 만 책임.
 */
export function useFeedPattern(
  data: NormalizedData,
  opts: FeedOptions = {},
): {
  rootProps: RootProps
  articleProps: (id: string) => ItemProps
  /** label element id 헬퍼 — `<h2 {...labelProps(id)}>…</h2>` 로 article 의 aria-labelledby 와 자동 연결. */
  labelProps: (id: string) => { id: string }
  items: BaseItem[]
} {
  const { busy, containerId = ROOT, idPrefix = 'feed', label, labelledBy } = opts
  const ids = getChildren(data, containerId)

  const items: BaseItem[] = ids.map((id, i) => ({
    id,
    label: getLabel(data, id),
    selected: false,
    disabled: false,
    posinset: i + 1,
    setsize: ids.length,
  }))

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'PageUp' && e.key !== 'PageDown') return
    const articles = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>(`[${ARTICLE_ATTR}]`),
    )
    if (articles.length === 0) return
    const active = document.activeElement as HTMLElement | null
    const currentIdx = articles.findIndex((a) => a === active || a.contains(active))
    if (currentIdx === -1) return
    const nextIdx = e.key === 'PageDown'
      ? Math.min(currentIdx + 1, articles.length - 1)
      : Math.max(currentIdx - 1, 0)
    if (nextIdx === currentIdx) return
    e.preventDefault()
    articles[nextIdx].focus()
  }, [])

  const articleId = (id: string) => `${idPrefix}-article-${id}`
  const labelId = (id: string) => `${idPrefix}-article-${id}-label`

  const rootProps: RootProps = {
    role: 'feed',
    'aria-busy': busy || undefined,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    onKeyDown,
  } as unknown as RootProps

  const articleProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    return {
      role: 'article',
      id: articleId(id),
      tabIndex: -1,
      [ARTICLE_ATTR]: '',
      'data-id': id,
      'aria-labelledby': labelId(id),
      'aria-posinset': it?.posinset,
      'aria-setsize': it?.setsize,
    } as unknown as ItemProps
  }

  const labelProps = (id: string) => ({ id: labelId(id) })

  return { rootProps, articleProps, labelProps, items }
}

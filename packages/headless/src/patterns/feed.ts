import { useMemo } from 'react'
import type { NormalizedData, UiEvent } from '../types'
import { pageNavigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps } from './types'

/** Feed 가 등록하는 axis — SSOT. PageUp/PageDown → 인접 article navigate. */
export const feedAxis = () => pageNavigate('vertical', 1)

export interface FeedItem {
  id: string
  label?: string
}

export type FeedEvent = { type: 'navigate'; id: string }

export interface FeedOptions {
  /** aria-busy — DOM 갱신 중 true. */
  busy?: boolean
  idPrefix?: string
  /** aria-label — ARIA: feed requires accessible name. */
  label?: string
  labelledBy?: string
  autoFocus?: boolean
}

const ARTICLE_ATTR = 'data-feed-article'

/**
 * feed — APG `/feed/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/feed/
 *
 * N 개 article 의 *bundle* — picker 가 아니므로 NormalizedData 가 아니라
 * `FeedItem[]` 직접 받음. PageUp/PageDown 으로 인접 article 이동.
 *
 * focus 는 article element(tabIndex=-1, 프로그램 focus only) 로 이동. article 내부의
 * focusable 자식이 native Tab 흐름. delegate.onKeyDown 의 `e.target.closest('[data-id]')`
 * 위임이 깊은 자식에서도 article id 추적.
 *
 * Ctrl+Home/End (feed 바깥 first/last focusable) 은 host 책임.
 */
export function useFeedPattern(
  items: FeedItem[],
  dispatch?: (e: FeedEvent) => void,
  opts: FeedOptions = {},
): {
  rootProps: RootProps
  articleProps: (id: string) => ItemProps
  labelProps: (id: string) => { id: string }
  items: (FeedItem & { posinset: number; setsize: number })[]
} {
  const { busy, idPrefix = 'feed', label, labelledBy, autoFocus } = opts

  const synth: NormalizedData = useMemo(() => ({
    entities: Object.fromEntries(items.map((it) => [it.id, { label: it.label }])),
    relationships: {},
    meta: { root: items.map((it) => it.id) },
  }), [items])

  const intent = (e: UiEvent) => {
    if (e.type === 'navigate') dispatch?.({ type: 'navigate', id: e.id })
  }

  const { bindFocus, delegate } = useRovingTabIndex(feedAxis(), synth, intent, { autoFocus })

  const articleId = (id: string) => `${idPrefix}-article-${id}`
  const labelId = (id: string) => `${idPrefix}-article-${id}-label`

  const rootProps: RootProps = {
    role: 'feed',
    'aria-busy': busy || undefined,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as unknown as RootProps

  const rendered = items.map((it, i) => ({ ...it, posinset: i + 1, setsize: items.length }))

  const articleProps = (id: string): ItemProps => {
    const it = rendered.find((x) => x.id === id)
    return {
      role: 'article',
      id: articleId(id),
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      tabIndex: -1,
      [ARTICLE_ATTR]: '',
      'data-id': id,
      'aria-labelledby': labelId(id),
      'aria-posinset': it?.posinset,
      'aria-setsize': it?.setsize,
    } as unknown as ItemProps
  }

  const labelProps = (id: string) => ({ id: labelId(id) })

  return { rootProps, articleProps, labelProps, items: rendered }
}

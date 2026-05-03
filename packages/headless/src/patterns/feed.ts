import { ROOT, getChildren, getLabel, type NormalizedData, type UiEvent } from '../types'
import { pageNavigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

/** Feed 가 등록하는 axis — SSOT. PageUp/PageDown → 인접 article navigate. */
export const feedAxis = () => pageNavigate('vertical', 1)

export interface FeedOptions {
  /** aria-busy — DOM 갱신 중 true. */
  busy?: boolean
  /** Container entity for nested feeds; defaults to ROOT. */
  containerId?: string
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
 * 키 매핑은 `pageNavigate` axis 로 박제 — PageUp/PageDown → 인접 article 로 navigate.
 * focus 는 article element(tabIndex=-1, 프로그램 focus only) 로 이동. article 내부의
 * focusable 자식이 native Tab 흐름. delegate.onKeyDown 의 `e.target.closest('[data-id]')`
 * 위임이 깊은 자식에서도 article id 추적.
 *
 * Ctrl+Home/End (feed 바깥 first/last focusable) 은 host 책임.
 */
export function useFeedPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: FeedOptions = {},
): {
  rootProps: RootProps
  articleProps: (id: string) => ItemProps
  labelProps: (id: string) => { id: string }
  items: BaseItem[]
} {
  const { busy, containerId = ROOT, idPrefix = 'feed', label, labelledBy, autoFocus } = opts
  const { bindFocus, delegate } = useRovingTabIndex(
    feedAxis(), data, onEvent ?? (() => {}), { autoFocus, containerId },
  )
  const ids = getChildren(data, containerId)

  const items: BaseItem[] = ids.map((id, i) => ({
    id,
    label: getLabel(data, id),
    selected: false,
    disabled: false,
    posinset: i + 1,
    setsize: ids.length,
  }))

  const articleId = (id: string) => `${idPrefix}-article-${id}`
  const labelId = (id: string) => `${idPrefix}-article-${id}-label`

  const rootProps: RootProps = {
    role: 'feed',
    'aria-busy': busy || undefined,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as unknown as RootProps

  const articleProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
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

  return { rootProps, articleProps, labelProps, items }
}

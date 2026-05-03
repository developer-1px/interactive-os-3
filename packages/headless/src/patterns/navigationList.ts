import { ROOT, getChildren, getLabel, type NormalizedData, type UiEvent } from '../types'
import type { ItemProps, RootProps } from './types'

export interface NavigationListOptions {
  /** 'none'(default, native Tab) | 'roving'(Arrow 추가). */
  keyboardNavigation?: 'none' | 'roving'
  orientation?: 'horizontal' | 'vertical'
  /** aria-label — ARIA: navigation landmark requires accessible name. */
  label?: string
  labelledBy?: string
}

/**
 * navigationList — sidebar/route navigation recipe.
 *
 * **Listbox 가 아니다.** APG에 단일 패턴 없음 — HTML `<nav>` landmark + `<a aria-current="page">`
 * 로 이루어진 합성. sidebar=listbox 안티패턴 차단이 본 recipe 의 존재 이유.
 *
 * - `aria-selected` 아닌 `aria-current="page"` 사용
 * - role=listbox/option 아닌 native nav/a
 * - 키보드는 native Tab/Enter 디폴트 — productivity 옵션으로 roving
 *
 * https://html.spec.whatwg.org/multipage/sections.html#the-nav-element
 * https://www.w3.org/TR/wai-aria-1.2/#aria-current
 */
export function navigationListPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: NavigationListOptions = {},
): {
  rootProps: RootProps
  linkProps: (id: string) => ItemProps
  items: { id: string; label: string; href?: string; current: boolean }[]
} {
  const { label, labelledBy } = opts
  const ids = getChildren(data, ROOT)
  const items = ids.map((id) => {
    const ent = data.entities[id] ?? {}
    return {
      id,
      label: getLabel(data, id),
      href: ent.href as string | undefined,
      current: Boolean(ent.current),
    }
  })

  const rootProps: RootProps = {
    role: 'navigation',
    'aria-label': label,
    'aria-labelledby': labelledBy,
  } as unknown as RootProps

  const linkProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    return {
      'data-id': id,
      href: it?.href,
      'aria-current': it?.current ? 'page' : undefined,
      'data-current': it?.current ? '' : undefined,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        onEvent?.({ type: 'activate', id })
      },
    } as unknown as ItemProps
  }

  return { rootProps, linkProps, items }
}

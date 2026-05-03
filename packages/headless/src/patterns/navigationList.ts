import type { ItemProps, RootProps } from './types'

export interface NavLink {
  id: string
  label?: string
  href?: string
  current?: boolean
  disabled?: boolean
}

export type NavigationListEvent = { type: 'activate'; id: string }

export interface NavigationListOptions {
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
 * - 키보드는 native Tab/Enter — pattern 이 추가 axis 등록 안 함
 *
 * N 개 link 의 *bundle* — picker 가 아니므로 NormalizedData 가 아니라
 * `NavLink[]` 직접 받음.
 *
 * https://html.spec.whatwg.org/multipage/sections.html#the-nav-element
 * https://www.w3.org/TR/wai-aria-1.2/#aria-current
 */
export function navigationListPattern(
  items: NavLink[],
  dispatch?: (e: NavigationListEvent) => void,
  opts: NavigationListOptions = {},
): {
  rootProps: RootProps
  linkProps: (id: string) => ItemProps
  items: NavLink[]
} {
  const { label, labelledBy } = opts

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
      'aria-disabled': it?.disabled || undefined,
      'data-current': it?.current ? '' : undefined,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        if (it?.disabled) return
        dispatch?.({ type: 'activate', id })
      },
    } as unknown as ItemProps
  }

  return { rootProps, linkProps, items }
}

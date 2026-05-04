import { Fragment, type ComponentPropsWithoutRef } from 'react'
import { useListboxPattern } from '@p/headless/patterns'
import { useSidebarNav } from './useSidebarNav'

const GROUPS = ['최근', '즐겨찾기'] as const

export function Sidebar() {
  const { data, onEvent, items } = useSidebarNav()
  const { rootProps, optionProps, items: rovingItems } = useListboxPattern(data, onEvent)
  const byId = new Map(items.map((it) => [it.id, it]))

  return (
    <ul
      {...(rootProps as ComponentPropsWithoutRef<'ul'>)}
      aria-label="사이드바"
      className="m-0 flex list-none flex-col overflow-y-auto p-3"
    >
      {GROUPS.map((g) => {
        const groupItems = rovingItems
          .map((it) => ({ it, view: byId.get(it.id) }))
          .filter((x): x is { it: typeof rovingItems[number]; view: SidebarItemView } => !!x.view && x.view.group === g)
        if (!groupItems.length) return null
        return (
          <Fragment key={g}>
            <li
              role="presentation"
              className="px-2 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500"
            >
              {g}
            </li>
            {groupItems.map(({ it, view }) => (
              <li
                key={it.id}
                {...(optionProps(it.id) as ComponentPropsWithoutRef<'li'>)}
                aria-posinset={it.posinset}
                aria-setsize={it.setsize}
                aria-selected={view.selected || undefined}
                aria-disabled={it.disabled || undefined}
                className={
                  'cursor-pointer rounded px-2 py-1 text-sm ' +
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ' +
                  (view.selected
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100')
                }
              >
                {view.label}
              </li>
            ))}
          </Fragment>
        )
      })}
    </ul>
  )
}

type SidebarItemView = ReturnType<typeof useSidebarNav>['items'][number]

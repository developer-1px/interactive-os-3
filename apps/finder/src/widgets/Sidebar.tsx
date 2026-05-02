import type { ComponentPropsWithoutRef } from 'react'
import { useListboxPattern } from '@p/headless/patterns'
import type { NormalizedData, UiEvent } from '@p/headless'
import { useSidebarNav } from './useSidebarNav'

export function Sidebar() {
  const { recent, fav } = useSidebarNav()
  return (
    <nav aria-label="사이드바" className="flex flex-col gap-4 overflow-y-auto p-3">
      <SidebarSection title="최근" data={recent.data} onEvent={recent.onEvent} />
      <SidebarSection title="즐겨찾기" data={fav.data} onEvent={fav.onEvent} />
    </nav>
  )
}

export function SidebarSection({
  title, data, onEvent,
}: { title: string; data: NormalizedData; onEvent: (e: UiEvent) => void }) {
  const headingId = `sidebar-${title.replace(/\s+/g, '-')}`
  const { rootProps, optionProps, items } = useListboxPattern(data, onEvent)
  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h3>
      <ul
        {...(rootProps as ComponentPropsWithoutRef<'ul'>)}
        aria-labelledby={headingId}
        className="m-0 list-none p-0"
      >
        {items.map((it) => {
          const d = data.entities[it.id]?.data ?? {}
          return (
            <li
              key={it.id}
              {...(optionProps(it.id) as ComponentPropsWithoutRef<'li'>)}
              aria-posinset={it.posinset}
              aria-setsize={it.setsize}
              aria-selected={it.selected || undefined}
              aria-disabled={it.disabled || undefined}
              className={
                'cursor-pointer rounded px-2 py-1 text-sm ' +
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ' +
                (it.selected
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100')
              }
            >
              {String(d.label ?? it.label)}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

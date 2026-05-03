import { useState } from 'react'
import {
  navigationListPattern,
  type NavLink,
  type NavigationListEvent,
} from '@p/headless/patterns'

export const meta = {
  title: 'Navigation List',
  apg: 'navigation-list',
  kind: 'bundle' as const,
  blurb: 'role="navigation" wrapping a list of links · aria-current="page" on the active one.',
  keys: () => [],
}

const initialItems: NavLink[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'docs', label: 'Docs', href: '#docs', current: true },
  { id: 'api', label: 'Api', href: '#api' },
  { id: 'guides', label: 'Guides', href: '#guides' },
]

export default function Demo() {
  const [items, setItems] = useState(initialItems)
  const dispatch = (e: NavigationListEvent) => {
    if (e.type === 'activate') {
      setItems((xs) => xs.map((it) => ({ ...it, current: it.id === e.id })))
    }
  }
  const { rootProps, linkProps } = navigationListPattern(items, dispatch, { label: 'Primary' })

  return (
    <nav {...rootProps} className="rounded-md border border-stone-200 bg-white p-2">
      <ul className="flex gap-1 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              {...linkProps(item.id)}
              className="block rounded px-3 py-1 hover:bg-stone-100 aria-[current=page]:bg-stone-900 aria-[current=page]:text-white"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import { fromList, singleCurrent } from '@p/aria-kernel'
import { navigationListPattern } from '@p/aria-kernel/patterns'
import { useLocalData } from '@p/aria-kernel/local'

export const meta = {
  title: 'Navigation List',
  apg: 'navigation-list',
  kind: 'collection' as const,
  blurb: 'A page navigation list with the current destination clearly highlighted.',
  keys: () => [],
}

export default function NavigationListDemo() {
  const [data, onEvent] = useLocalData(
    () => fromList([
      { id: 'home', label: 'Home', href: '#home' },
      { id: 'docs', label: 'Docs', href: '#docs', current: true },
      { id: 'api', label: 'Api', href: '#api' },
      { id: 'guides', label: 'Guides', href: '#guides' },
    ]),
    singleCurrent,
  )
  const { rootProps, linkProps, items } = navigationListPattern(data, onEvent, { label: 'Primary' })

  return (
    <nav {...rootProps} className="rounded-md border border-stone-200 bg-white p-2">
      <ul className="flex gap-1 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              {...linkProps(item.id)}
              className="block rounded px-3 py-1 [&:not([aria-current=page])]:hover:bg-stone-200 aria-[current=page]:bg-stone-900 aria-[current=page]:text-white"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

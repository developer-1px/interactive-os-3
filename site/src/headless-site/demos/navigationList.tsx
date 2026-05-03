import { composeReducers, reduce, singleCurrent, type NormalizedData } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { navigationListPattern } from '@p/headless/patterns'

export const meta = {
  title: 'Navigation List',
  apg: 'navigation-list',
  kind: 'collection' as const,
  blurb: 'role="navigation" wrapping a list of links · aria-current="page" on the active one.',
  keys: () => [],
}

const ITEMS = ['home', 'docs', 'api', 'guides']
const initial: NormalizedData = {
  entities: Object.fromEntries(
    ITEMS.map((id) => [
      id,
      { label: id[0].toUpperCase() + id.slice(1), href: `#${id}`, current: id === 'docs' },
    ]),
  ),
  relationships: {},
  meta: { root: ITEMS },
}

const reducer = composeReducers(reduce, singleCurrent)

export default function Demo() {
  const [data, onEvent] = useLocalData(initial, reducer)
  const { rootProps, linkProps, items } = navigationListPattern(data, onEvent, { label: 'Primary' })

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

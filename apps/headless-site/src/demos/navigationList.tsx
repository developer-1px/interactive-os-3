import { useState } from 'react'
import { ROOT, type NormalizedData } from '@p/headless'
import { navigationListPattern } from '@p/headless/patterns'

export const meta = {
  title: 'Navigation List',
  apg: 'navigation-list',
  kind: 'collection' as const,
  blurb: 'role="navigation" wrapping a list of links · aria-current="page" on the active one.',
  keys: () => [],
}

function build(currentId: string): NormalizedData {
  const ids = ['home', 'docs', 'api', 'guides']
  return {
    entities: {
      [ROOT]: { id: ROOT },
      ...Object.fromEntries(
        ids.map((id) => [
          id,
          { id, data: { label: id[0].toUpperCase() + id.slice(1), href: `#${id}`, current: id === currentId } },
        ]),
      ),
    },
    relationships: { [ROOT]: ids },
  }
}

export default function Demo() {
  const [current, setCurrent] = useState('docs')
  const data = build(current)
  const { rootProps, linkProps, items } = navigationListPattern(data, undefined, { ariaLabel: 'Primary' })

  return (
    <nav {...rootProps} className="rounded-md border border-stone-200 bg-white p-2">
      <ul className="flex gap-1 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              {...linkProps(item.id)}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                setCurrent(item.id)
              }}
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

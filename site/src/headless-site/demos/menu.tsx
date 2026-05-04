import { fromList } from '@p/headless'
import { menuAxis, useMenuPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Menu',
  apg: 'menu',
  kind: 'collection' as const,
  blurb: 'role="menu" · vertical Arrow nav · typeahead · activate emits via onEvent.',
  keys: () => dedupe(probe(menuAxis())),
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() =>
    fromList([{ label: 'New file' }, { label: 'Open…' }, { label: 'Save' }, { label: 'Close' }]),
  )
  const { rootProps, menuitemProps, buttonProps, items, open } = useMenuPattern(data, onEvent)

  return (
    <div className="relative inline-block">
      <button
        {...buttonProps}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
      >
        File ▾
      </button>
      {open && (
        <ul
          {...rootProps}
          className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md border border-stone-200 bg-white p-1 shadow-lg text-sm"
        >
          {items.map((item) => (
            <li
              key={item.id}
              {...menuitemProps(item.id)}
              className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 aria-disabled:opacity-50"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

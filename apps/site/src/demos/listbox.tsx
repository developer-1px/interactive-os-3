import { fromList } from '@p/headless'
import { listboxAxis, useListboxPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../catalog/keys'

export const meta = {
  title: 'Listbox',
  apg: 'listbox',
  kind: 'collection' as const,
  blurb: 'Single-select · typeahead · APG selection-follows-focus.',
  keys: () => dedupe(probe(listboxAxis())),
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() =>
    fromList([{ label: 'Apple' }, { label: 'Banana' }, { label: 'Cherry' }, { label: 'Durian' }]),
  )
  const { rootProps, optionProps, items } = useListboxPattern(data, onEvent)

  return (
    <ul
      {...rootProps}
      aria-label="Fruits"
      className="w-56 rounded-md border border-stone-200 bg-white p-1 text-sm"
    >
      {items.map((item) => (
        <li
          key={item.id}
          {...optionProps(item.id)}
          className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 aria-selected:bg-stone-900 aria-selected:text-white"
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}

import { fromList } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { comboboxAxis, useComboboxPattern } from '@p/headless/patterns'
import { axisKeys } from '@p/headless'

export const meta = {
  title: 'Combobox · Autocomplete None',
  apg: 'combobox',
  kind: 'collection' as const,
  blurb: 'No autocomplete — popup opens only on Alt+Down or typing, free input allowed.',
  keys: () => axisKeys(comboboxAxis()),
}

const ALL = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Denmark', 'France', 'Germany', 'Japan']

export default function Demo() {
  const [data, onEvent] = useLocalData(() => fromList(ALL.map((label) => ({ label }))))
  const { comboboxProps, listboxProps, optionProps, items, expanded } = useComboboxPattern(data, onEvent, {
    label: 'Country',
    autocomplete: 'none',
    filter: () => true,
  })

  return (
    <div className="relative w-64">
      <input
        {...comboboxProps}
        placeholder="Alt+Down to open…"
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
      />
      {expanded && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-stone-200 bg-white shadow-lg">
          <ul {...listboxProps} className="max-h-48 overflow-auto p-1 text-sm">
            {items.map((item) => (
              <li
                key={item.id}
                {...optionProps(item.id)}
                className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 data-[active]:bg-stone-100 aria-selected:bg-stone-900 aria-selected:text-white"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

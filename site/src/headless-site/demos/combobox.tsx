import { comboboxAxis, useComboboxPattern } from '@p/headless/patterns'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Combobox',
  apg: 'combobox',
  kind: 'collection' as const,
  blurb: 'role="combobox" · aria-activedescendant on input · APG single exception to roving (B11).',
  keys: () => dedupe(probe(comboboxAxis())),
}

const ALL = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Denmark', 'France', 'Germany', 'Japan']
  .map((label) => ({ label }))

export default function Demo() {
  const { comboboxProps, listboxProps, optionProps, items } =
    useComboboxPattern({ items: ALL, label: 'Country' })

  return (
    <div className="relative w-64">
      <input
        {...comboboxProps}
        placeholder="Search country…"
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
      />
      <ul
        {...listboxProps}
        className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-md border border-stone-200 bg-white p-1 text-sm shadow-lg"
      >
        {items.length === 0 ? (
          <li className="px-2 py-1 text-xs text-stone-500">No matches</li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              {...optionProps(item.id)}
              className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 data-[active]:bg-stone-100 aria-selected:bg-stone-900 aria-selected:text-white"
            >
              {item.label}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

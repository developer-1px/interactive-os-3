import { useMemo, useState } from 'react'
import { fromList } from '@p/headless'
import { useComboboxPattern } from '@p/headless/patterns'
import { useLocalData } from './_useLocalData'

export const meta = {
  title: 'Combobox',
  apg: 'combobox',
  kind: 'collection' as const,
  blurb: 'role="combobox" · aria-activedescendant on input · APG single exception to roving (B11).',
}

const ALL = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Denmark', 'France', 'Germany', 'Japan']

export default function Demo() {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const filtered = useMemo(
    () => ALL.filter((c) => c.toLowerCase().includes(query.toLowerCase())),
    [query],
  )
  const [data, onEvent] = useLocalData(() => fromList(filtered.map((label) => ({ label }))))
  const { inputProps, popoverProps, listProps, optionProps, items } = useComboboxPattern(
    data,
    onEvent,
    { expanded },
  )

  return (
    <div className="relative w-64">
      <input
        {...inputProps}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setExpanded(true)
        }}
        onFocus={() => setExpanded(true)}
        onBlur={() => setTimeout(() => setExpanded(false), 100)}
        placeholder="Search country…"
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
      />
      <div {...popoverProps} className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-stone-200 bg-white shadow-lg">
        <ul {...listProps} className="max-h-48 overflow-auto p-1 text-sm">
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
      </div>
    </div>
  )
}

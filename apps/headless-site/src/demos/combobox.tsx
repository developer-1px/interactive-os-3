import { useMemo, useState } from 'react'
import { activate, fromList, navigate, reduce, ROOT, type UiEvent } from '@p/headless'
import { useComboboxPattern } from '@p/headless/patterns'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Combobox',
  apg: 'combobox',
  kind: 'collection' as const,
  blurb: 'role="combobox" · aria-activedescendant on input · APG single exception to roving (B11).',
  keys: () => dedupe([...probe(navigate('vertical')), ...probe(activate), 'Escape']),
}

const ALL = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Denmark', 'France', 'Germany', 'Japan']

export default function Demo() {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [focusId, setFocusId] = useState<string | null>(null)

  // data is derived from query (not local state) — filter must re-flow when typing.
  // narrow한 결과의 첫 매치를 auto-highlight: 1개로 좁아지면 Enter로 즉시 선택.
  const data = useMemo(() => {
    const filtered = ALL.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    const list = fromList(filtered.map((label) => ({ label })))
    const validFocus = focusId && list.entities[focusId] ? focusId : list.relationships[ROOT]?.[0]
    return validFocus ? reduce(list, { type: 'navigate', id: validFocus }) : list
  }, [query, focusId])

  const onEvent = (e: UiEvent) => {
    if (e.type === 'navigate') setFocusId(e.id)
    if (e.type === 'activate') {
      const ent = data.entities[e.id]
      const label = ent?.data?.label
      if (typeof label === 'string') {
        setQuery(label)
        setExpanded(false)
      }
    }
  }

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
          setFocusId(null) // useMemo가 첫 매치로 재설정
        }}
        onFocus={() => setExpanded(true)}
        onBlur={() => setTimeout(() => setExpanded(false), 100)}
        placeholder="Search country…"
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
      />
      <div
        {...popoverProps}
        className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-stone-200 bg-white shadow-lg"
      >
        {items.length === 0 ? (
          <p className="px-2 py-1 text-xs text-stone-500">No matches</p>
        ) : (
          <ul {...listProps} className="max-h-48 overflow-auto p-1 text-sm">
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
        )}
      </div>
    </div>
  )
}

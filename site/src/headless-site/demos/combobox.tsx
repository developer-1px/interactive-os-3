import { useMemo, useState } from 'react'
import { ROOT, fromList, getRoot, reduce, useControlState, type UiEvent } from '@p/headless'
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

export default function Demo() {
  const [query, setQuery] = useState('')

  // base 는 query 에서 파생, focus/open 등 meta 는 useControlState 가 보존.
  const base = useMemo(() => {
    const filtered = ALL.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    const list = fromList(filtered.map((label) => ({ label })))
    const seed = getRoot(list)[0]
    return seed ? reduce(list, { type: 'navigate', id: seed }) : list
  }, [query])
  const [data, dispatch] = useControlState(base)

  // 모든 변화는 onEvent 로 — dispatch 통과 + host 사이드이펙트.
  const onEvent = (e: UiEvent) => {
    dispatch(e)
    if (e.type === 'value') setQuery(String(e.value))
    if (e.type === 'activate') {
      const label = data.entities[e.id]?.label
      if (typeof label === 'string') setQuery(label)
      dispatch({ type: 'open', id: ROOT, open: false })
    }
  }

  const { comboboxProps, listboxProps, optionProps, items } =
    useComboboxPattern(data, onEvent, { label: 'Country', value: query })

  const expanded = Boolean(data.meta?.open?.includes(ROOT))

  return (
    <div className="relative w-64">
      <input
        {...comboboxProps}
        placeholder="Search country…"
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
      />
      {expanded && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-stone-200 bg-white shadow-lg">
          {items.length === 0 ? (
            <p className="px-2 py-1 text-xs text-stone-500">No matches</p>
          ) : (
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
          )}
        </div>
      )}
    </div>
  )
}

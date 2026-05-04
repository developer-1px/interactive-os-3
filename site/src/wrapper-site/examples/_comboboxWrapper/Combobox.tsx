import { useMemo, useState } from 'react'
import {
  ROOT, fromList, getRoot, reduce, useControlState,
  type NormalizedData, type UiEvent,
} from '@p/headless'
import { useComboboxPattern } from '@p/headless/patterns'
import {
  defaultLabel,
  renderSlot,
  type ComboboxSlots,
} from './slots'

export interface ComboboxProps<TItem extends object = Record<string, unknown>> {
  data: NormalizedData
  onEvent: (event: UiEvent) => void
  'aria-label': string
  slots?: ComboboxSlots<TItem>
  placeholder?: string
}

export function Combobox<TItem extends object = Record<string, unknown>>({
  data,
  onEvent,
  slots = {},
  'aria-label': ariaLabel,
  placeholder = 'Search…',
}: ComboboxProps<TItem>) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const ids = getRoot(data)
    const matches = ids.filter((id) => {
      const label = data.entities[id]?.label
      return typeof label === 'string' && label.toLowerCase().includes(query.toLowerCase())
    })
    const list = fromList(matches.map((id) => ({ id, ...(data.entities[id] ?? {}) })))
    const seed = getRoot(list)[0]
    return seed ? reduce(list, { type: 'navigate', id: seed }) : list
  }, [data, query])

  const [view, dispatch] = useControlState(filtered)

  const relay = (e: UiEvent) => {
    dispatch(e)
    if (e.type === 'value') setQuery(String(e.value))
    onEvent(e)
  }

  const { comboboxProps, listboxProps, optionProps, items } =
    useComboboxPattern(view, relay, { label: ariaLabel, value: query })

  const expanded = Boolean(view.meta?.open?.includes(ROOT))

  return (
    <div className="relative w-64">
      <input
        {...comboboxProps}
        placeholder={placeholder}
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      {expanded && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-stone-200 bg-white shadow-lg">
          {items.length === 0 ? (
            <p className="px-3 py-2 text-xs text-stone-500">No matches</p>
          ) : (
            <ul {...listboxProps} className="max-h-48 overflow-auto p-1 text-sm">
              {items.map((item) => {
                const itemData = (view.entities[item.id] ?? {}) as TItem
                return (
                  <li
                    key={item.id}
                    {...optionProps(item.id)}
                    className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 data-[active]:bg-stone-100 aria-selected:bg-blue-600 aria-selected:text-white"
                  >
                    {renderSlot(slots.label, defaultLabel, item, itemData)}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

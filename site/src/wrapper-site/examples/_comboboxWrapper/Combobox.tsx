import { useMemo } from 'react'
import { getRoot, type NormalizedData, type UiEvent } from '@p/headless'
import { useComboboxPattern } from '@p/headless/patterns'
import {
  defaultLabel,
  renderSlot,
  type ComboboxSlots,
} from './slots'

export interface ComboboxProps<TItem extends { label: string } = { label: string }> {
  data: NormalizedData
  onEvent: (event: UiEvent) => void
  'aria-label': string
  slots?: ComboboxSlots<TItem>
  placeholder?: string
}

export function Combobox<TItem extends { label: string } = { label: string }>({
  data,
  onEvent,
  slots = {},
  'aria-label': ariaLabel,
  placeholder = 'Search…',
}: ComboboxProps<TItem>) {
  // wrapper 가 NormalizedData 를 받는 외부 API — 패턴은 raw items 시그니처라 변환.
  const items = useMemo(() => {
    const ids = getRoot(data)
    return ids.map((id) => ({ id, ...(data.entities[id] ?? {}) })) as unknown as TItem[]
  }, [data])

  const { comboboxProps, listboxProps, optionProps, items: viewItems } =
    useComboboxPattern<TItem>({
      items,
      label: ariaLabel,
      onEvent,
    })

  return (
    <div className="relative w-64">
      <input
        {...comboboxProps}
        placeholder={placeholder}
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      <ul
        {...listboxProps}
        className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-md border border-stone-200 bg-white p-1 text-sm shadow-lg"
      >
        {viewItems.length === 0 ? (
          <li className="px-3 py-2 text-xs text-stone-500">No matches</li>
        ) : (
          viewItems.map((item) => (
            <li
              key={item.id}
              {...optionProps(item.id)}
              className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 data-[active]:bg-stone-100 aria-selected:bg-blue-600 aria-selected:text-white"
            >
              {renderSlot(slots.label, defaultLabel, item, item.raw)}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

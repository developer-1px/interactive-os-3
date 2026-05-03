import type { NormalizedData, UiEvent } from '@p/headless'
import { useTreePattern } from '@p/headless/patterns'
import {
  defaultLabel,
  emptySlot,
  renderSlot,
  type TreeSlots,
} from './slots'

export interface TreeProps<TItem extends object = Record<string, unknown>> {
  data: NormalizedData
  onEvent: (event: UiEvent) => void
  'aria-label': string
  slots?: TreeSlots<TItem>
}

export function Tree<TItem extends object = Record<string, unknown>>({
  data,
  onEvent,
  slots = {},
  'aria-label': ariaLabel,
}: TreeProps<TItem>) {
  const { rootProps, itemProps, items } = useTreePattern(data, onEvent)

  return (
    <ul
      {...rootProps}
      aria-label={ariaLabel}
      className="w-72 select-none rounded-md border border-stone-200 bg-white py-1 text-sm text-stone-900"
    >
      {items.map((item) => {
        const itemData = (data.entities[item.id] ?? {}) as TItem
        return (
          <li
            key={item.id}
            {...itemProps(item.id)}
            className="relative cursor-pointer leading-7 hover:bg-stone-100 aria-selected:bg-blue-600 aria-selected:text-white"
          >
            {/* indent guides — 부모 깊이만큼 vertical line. 마지막 줄만 그어 진짜 tree 답게. */}
            {Array.from({ length: item.level }, (_, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute top-0 bottom-0 w-px bg-stone-200 group-aria-selected:bg-blue-300"
                style={{ left: 8 + i * 16 + 7 }}
              />
            ))}
            <span
              className="relative flex items-center gap-1.5"
              style={{ paddingLeft: 8 + item.level * 16 }}
            >
              <span aria-hidden className="inline-flex w-4 shrink-0 justify-center text-stone-400 aria-selected:text-white">
                {item.hasChildren ? (item.expanded ? '▾' : '▸') : ''}
              </span>
              <span aria-hidden className="inline-flex w-4 shrink-0 justify-center text-base leading-none">
                {renderSlot(slots.icon, emptySlot, item, itemData)}
              </span>
              <span className="truncate flex-1">
                {renderSlot(slots.label, defaultLabel, item, itemData)}
              </span>
              <span className="px-1 font-mono text-[10px] uppercase text-stone-400 group-aria-selected:text-blue-100">
                {renderSlot(slots.trailing, emptySlot, item, itemData)}
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

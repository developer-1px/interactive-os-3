import type { NormalizedData, UiEvent } from '@p/headless'
import { useTreePattern } from '@p/headless/patterns'
import {
  branchIndicator,
  defaultLabel,
  emptySlot,
  renderSlot,
  type TreeSlots,
} from './slots'

export interface TreeProps {
  store: NormalizedData
  value: NormalizedData
  onEvent: (event: UiEvent) => void
  'aria-label': string
  slots?: TreeSlots
}

export function Tree({ store, value, onEvent, slots = {}, 'aria-label': ariaLabel }: TreeProps) {
  const data = {
    entities: { ...store.entities, ...value.entities },
    relationships: store.relationships,
  }
  const { rootProps, itemProps, items } = useTreePattern(data, onEvent)

  return (
    <ul
      {...rootProps}
      aria-label={ariaLabel}
      className="w-72 rounded-md border border-stone-200 bg-white p-1 text-sm"
    >
      {items.map((item) => {
        const itemData = data.entities[item.id]?.data ?? {}
        return (
          <li
            key={item.id}
            {...itemProps(item.id)}
            style={{ paddingLeft: 8 + item.level * 16 }}
            className="grid cursor-pointer grid-cols-[1rem_2rem_1fr_auto] items-center gap-1 rounded py-1 pr-2 hover:bg-stone-100 aria-selected:bg-stone-900 aria-selected:text-white"
          >
            <span data-slot="indicator" className="text-center text-stone-400">
              {renderSlot(slots.indicator, branchIndicator, item, itemData)}
            </span>
            <span data-slot="icon" className="font-mono text-[10px] uppercase text-stone-500">
              {renderSlot(slots.icon, emptySlot, item, itemData)}
            </span>
            <span data-slot="label" className="truncate">
              {renderSlot(slots.label, defaultLabel, item, itemData)}
            </span>
            <span data-slot="trailing" className="font-mono text-[10px] uppercase text-stone-400">
              {renderSlot(slots.trailing, emptySlot, item, itemData)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

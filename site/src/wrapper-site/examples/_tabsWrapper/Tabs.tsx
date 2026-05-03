import type { NormalizedData, UiEvent } from '@p/headless'
import { useTabsPattern } from '@p/headless/patterns'
import {
  defaultLabel,
  emptySlot,
  renderSlot,
  type TabsSlots,
} from './slots'

export interface TabsProps<TItem extends object = Record<string, unknown>> {
  data: NormalizedData
  onEvent: (event: UiEvent) => void
  'aria-label': string
  slots?: TabsSlots<TItem>
}

export function Tabs<TItem extends object = Record<string, unknown>>({
  data,
  onEvent,
  slots = {},
  'aria-label': ariaLabel,
}: TabsProps<TItem>) {
  const { rootProps, tabProps, panelProps, items } = useTabsPattern(data, onEvent)

  return (
    <div className="space-y-3">
      <div {...rootProps} aria-label={ariaLabel} className="flex gap-1 border-b border-stone-200">
        {items.map((item) => {
          const itemData = (data.entities[item.id] ?? {}) as TItem
          return (
            <button
              key={item.id}
              {...tabProps(item.id)}
              className="px-3 py-1.5 text-sm text-stone-600 border-b-2 border-transparent aria-selected:border-blue-600 aria-selected:text-blue-700 hover:text-stone-900"
            >
              {renderSlot(slots.label, defaultLabel, item, itemData)}
            </button>
          )
        })}
      </div>
      {items.map((item) => {
        const itemData = (data.entities[item.id] ?? {}) as TItem
        return (
          <div
            key={item.id}
            {...panelProps(item.id)}
            className="rounded-md bg-stone-50 p-3 text-sm text-stone-700"
          >
            {renderSlot(slots.panel, emptySlot, item, itemData)}
          </div>
        )
      })}
    </div>
  )
}

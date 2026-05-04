import type { NormalizedData, UiEvent } from '@p/headless'
import { useAccordionPattern } from '@p/headless/patterns'
import {
  defaultLabel,
  emptySlot,
  renderSlot,
  type AccordionSlots,
} from './slots'

export interface AccordionProps<TItem extends object = Record<string, unknown>> {
  data: NormalizedData
  onEvent: (event: UiEvent) => void
  'aria-label': string
  slots?: AccordionSlots<TItem>
  mode?: 'multiple' | 'single'
}

export function Accordion<TItem extends object = Record<string, unknown>>({
  data,
  onEvent,
  slots = {},
  'aria-label': ariaLabel,
  mode = 'multiple',
}: AccordionProps<TItem>) {
  const { rootProps, headingProps, buttonProps, regionProps, items } =
    useAccordionPattern(data, onEvent, { mode })

  return (
    <div
      {...rootProps}
      aria-label={ariaLabel}
      className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white"
    >
      {items.map((item) => {
        const itemData = (data.entities[item.id] ?? {}) as TItem
        return (
          <div key={item.id}>
            <h3 {...headingProps(item.id)} className="m-0">
              <button
                {...buttonProps(item.id)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium hover:bg-stone-50"
              >
                {renderSlot(slots.label, defaultLabel, item, itemData)}
                <span aria-hidden className="text-stone-400">{item.expanded ? '▾' : '▸'}</span>
              </button>
            </h3>
            <div {...regionProps(item.id)} className="px-3 py-2 text-sm text-stone-600 bg-stone-50">
              {renderSlot(slots.panel, emptySlot, item, itemData)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

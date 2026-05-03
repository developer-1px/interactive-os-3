import type { BaseItem } from '@p/headless/patterns'
import type { ReactNode } from 'react'

export type AccordionSlot<TItem extends object = Record<string, unknown>> = (
  props: AccordionSlotProps<TItem>
) => ReactNode

export interface AccordionSlotProps<TItem extends object = Record<string, unknown>> {
  item: BaseItem & { expanded: boolean }
  data: TItem
}

export interface AccordionSlots<TItem extends object = Record<string, unknown>> {
  label?: AccordionSlot<TItem>
  panel?: AccordionSlot<TItem>
}

export function renderSlot<TItem extends object>(
  slot: AccordionSlot<TItem> | undefined,
  fallback: AccordionSlot<TItem>,
  item: BaseItem & { expanded: boolean },
  data: TItem,
) {
  const Slot = slot ?? fallback
  return <Slot item={item} data={data} />
}

export function defaultLabel<TItem extends object>({ item }: AccordionSlotProps<TItem>) {
  return item.label
}

export function emptySlot() {
  return null
}

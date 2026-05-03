import type { BaseItem } from '@p/headless/patterns'
import type { ReactNode } from 'react'

export type TabsSlot<TItem extends object = Record<string, unknown>> = (
  props: TabsSlotProps<TItem>
) => ReactNode

export interface TabsSlotProps<TItem extends object = Record<string, unknown>> {
  item: BaseItem
  data: TItem
}

export interface TabsSlots<TItem extends object = Record<string, unknown>> {
  label?: TabsSlot<TItem>
  panel?: TabsSlot<TItem>
}

export function renderSlot<TItem extends object>(
  slot: TabsSlot<TItem> | undefined,
  fallback: TabsSlot<TItem>,
  item: BaseItem,
  data: TItem,
) {
  const Slot = slot ?? fallback
  return <Slot item={item} data={data} />
}

export function defaultLabel<TItem extends object>({ item }: TabsSlotProps<TItem>) {
  return item.label
}

export function emptySlot() {
  return null
}

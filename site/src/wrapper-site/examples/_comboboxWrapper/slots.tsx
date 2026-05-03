import type { BaseItem } from '@p/headless/patterns'
import type { ReactNode } from 'react'

export type ComboboxSlot<TItem extends object = Record<string, unknown>> = (
  props: ComboboxSlotProps<TItem>
) => ReactNode

export interface ComboboxSlotProps<TItem extends object = Record<string, unknown>> {
  item: BaseItem
  data: TItem
}

export interface ComboboxSlots<TItem extends object = Record<string, unknown>> {
  label?: ComboboxSlot<TItem>
}

export function renderSlot<TItem extends object>(
  slot: ComboboxSlot<TItem> | undefined,
  fallback: ComboboxSlot<TItem>,
  item: BaseItem,
  data: TItem,
) {
  const Slot = slot ?? fallback
  return <Slot item={item} data={data} />
}

export function defaultLabel<TItem extends object>({ item }: ComboboxSlotProps<TItem>) {
  return item.label
}

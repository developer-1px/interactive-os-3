import type { BaseItem } from '@p/headless/patterns'
import type { ReactNode } from 'react'

export type MenuSlot<TItem extends object = Record<string, unknown>> = (
  props: MenuSlotProps<TItem>
) => ReactNode

export interface MenuSlotProps<TItem extends object = Record<string, unknown>> {
  item: BaseItem
  data: TItem
}

export interface MenuSlots<TItem extends object = Record<string, unknown>> {
  icon?: MenuSlot<TItem>
  label?: MenuSlot<TItem>
  shortcut?: MenuSlot<TItem>
}

export function renderSlot<TItem extends object>(
  slot: MenuSlot<TItem> | undefined,
  fallback: MenuSlot<TItem>,
  item: BaseItem,
  data: TItem,
) {
  const Slot = slot ?? fallback
  return <Slot item={item} data={data} />
}

export function defaultLabel<TItem extends object>({ item }: MenuSlotProps<TItem>) {
  return item.label
}

export function emptySlot() {
  return null
}

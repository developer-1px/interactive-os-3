import type { TreeItem } from '@p/headless/patterns'
import type { ReactNode } from 'react'

export type TreeSlot<TItem extends object = Record<string, unknown>> = (
  props: TreeSlotProps<TItem>
) => ReactNode

export interface TreeSlotProps<TItem extends object = Record<string, unknown>> {
  item: TreeItem
  data: TItem
}

export interface TreeSlots<TItem extends object = Record<string, unknown>> {
  icon?: TreeSlot<TItem>
  label?: TreeSlot<TItem>
  trailing?: TreeSlot<TItem>
}

export function renderSlot<TItem extends object>(
  slot: TreeSlot<TItem> | undefined,
  fallback: TreeSlot<TItem>,
  item: TreeItem,
  data: TItem,
) {
  const Slot = slot ?? fallback
  return <Slot item={item} data={data} />
}

export function defaultLabel<TItem extends object>({ item }: TreeSlotProps<TItem>) {
  return item.label
}

export function emptySlot() {
  return null
}

import type { BaseItem } from '@p/headless/patterns'
import type { ReactNode } from 'react'

export type MenuSlot = (props: MenuSlotProps) => ReactNode

export interface MenuSlotProps {
  item: BaseItem
  data: Record<string, unknown>
}

export interface MenuSlots {
  icon?: MenuSlot
  label?: MenuSlot
  shortcut?: MenuSlot
}

export function renderSlot(
  slot: MenuSlot | undefined,
  fallback: MenuSlot,
  item: BaseItem,
  data: Record<string, unknown>,
) {
  const Slot = slot ?? fallback
  return <Slot item={item} data={data} />
}

export function defaultLabel({ item }: MenuSlotProps) {
  return item.label
}

export function emptySlot() {
  return null
}

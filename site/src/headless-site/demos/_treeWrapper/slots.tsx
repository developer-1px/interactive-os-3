import type { TreeItem } from '@p/headless/patterns'
import type { ReactNode } from 'react'

export type TreeSlot = (props: TreeSlotProps) => ReactNode

export interface TreeSlotProps {
  item: TreeItem
  data: Record<string, unknown>
}

export interface TreeSlots {
  indicator?: TreeSlot
  icon?: TreeSlot
  label?: TreeSlot
  trailing?: TreeSlot
}

export function renderSlot(
  slot: TreeSlot | undefined,
  fallback: TreeSlot,
  item: TreeItem,
  data: Record<string, unknown>,
) {
  const Slot = slot ?? fallback
  return <Slot item={item} data={data} />
}

export function branchIndicator({ item }: TreeSlotProps) {
  if (!item.hasChildren) return null
  return item.expanded ? '-' : '+'
}

export function defaultLabel({ item }: TreeSlotProps) {
  return item.label
}

export function emptySlot() {
  return null
}

import type { ReactNode } from 'react'

export type DialogSlot = () => ReactNode

export interface DialogSlots {
  header?: DialogSlot
  body?: DialogSlot
  footer?: DialogSlot
}

export function renderSlot(slot: DialogSlot | undefined, fallback: DialogSlot) {
  const Slot = slot ?? fallback
  return <Slot />
}

export function emptySlot() {
  return null
}

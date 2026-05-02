import type { NormalizedData, UiEvent } from '@p/headless'
import { useMenuPattern } from '@p/headless/patterns'
import { useRef, useState } from 'react'
import { defaultLabel, emptySlot, renderSlot, type MenuSlots } from './slots'

export interface MenuProps {
  store: NormalizedData
  value: NormalizedData
  onEvent: (event: UiEvent) => void
  label: string
  slots?: MenuSlots
}

export function Menu({ store, value, onEvent, label, slots = {} }: MenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const data = {
    entities: { ...store.entities, ...value.entities },
    relationships: store.relationships,
  }
  const closeMenu = () => {
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }
  const { rootProps, itemProps, items } = useMenuPattern(
    data,
    (event) => {
      onEvent(event)
      if (event.type === 'activate') closeMenu()
    },
    { autoFocus: open, onEscape: closeMenu },
  )
  const hasSlots = Object.keys(slots).length > 0

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            setOpen(true)
          }
        }}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
      >
        {label}
      </button>
      {open && (
        <ul
          {...rootProps}
          className="absolute left-0 top-full z-10 mt-1 w-56 rounded-md border border-stone-200 bg-white p-1 text-sm shadow-lg"
        >
          {items.map((item) => {
            const itemData = data.entities[item.id]?.data ?? {}
            return (
              <li
                key={item.id}
                {...itemProps(item.id)}
                className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 aria-disabled:opacity-50"
              >
                {hasSlots ? (
                  <span className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-2">
                    <span data-slot="icon" className="text-stone-400">
                      {renderSlot(slots.icon, emptySlot, item, itemData)}
                    </span>
                    <span data-slot="label" className="truncate">
                      {renderSlot(slots.label, defaultLabel, item, itemData)}
                    </span>
                    <span data-slot="shortcut" className="font-mono text-[10px] text-stone-400">
                      {renderSlot(slots.shortcut, emptySlot, item, itemData)}
                    </span>
                  </span>
                ) : (
                  item.label
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

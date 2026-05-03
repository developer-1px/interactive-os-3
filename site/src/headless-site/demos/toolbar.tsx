import { useState } from 'react'
import { toolbarAxis, useToolbarPattern, type ToolbarItem } from '@p/headless/patterns'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Toolbar',
  apg: 'toolbar',
  kind: 'bundle' as const,
  blurb: 'role="toolbar" · single Tab stop · Arrow keys roam internal items · Enter/Space activate.',
  keys: () => dedupe(probe(toolbarAxis())),
}

const initialItems: ToolbarItem[] = [
  { id: 'bold', label: 'Bold' },
  { id: 'italic', label: 'Italic' },
  { id: 'underline', label: 'Underline' },
  { id: 'sep', separator: true },
  { id: 'link', label: 'Link' },
]

export default function Demo() {
  const [items] = useState(initialItems)
  const { rootProps, itemProps } = useToolbarPattern(items, undefined, { label: 'Formatting' })

  return (
    <div
      {...rootProps}
      className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white p-1 text-sm"
    >
      {items.map((item) =>
        item.separator ? (
          <span key={item.id} aria-hidden className="px-1 text-stone-300">
            |
          </span>
        ) : (
          <button
            key={item.id}
            {...itemProps(item.id)}
            className="rounded px-2 py-1 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-stone-900"
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  )
}

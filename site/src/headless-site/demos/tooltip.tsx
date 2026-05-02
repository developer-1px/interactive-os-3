import { useRef } from 'react'
import { useTooltipPattern } from '@p/headless/patterns'

export const meta = {
  title: 'Tooltip',
  apg: 'tooltip',
  kind: 'ref' as const,
  blurb: 'Hover/focus delays · Escape closes · trigger ↔ tip linked via aria-describedby.',
  keys: () => ['Escape'],
}

export default function Demo() {
  const ref = useRef<HTMLButtonElement>(null)
  const { open, triggerProps, tipProps } = useTooltipPattern(ref)

  return (
    <div className="relative inline-block">
      <button
        {...triggerProps}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
      >
        Hover or focus me
      </button>
      {open && (
        <span
          {...tipProps}
          className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-stone-900 px-2 py-1 text-xs text-white shadow"
        >
          Linked via aria-describedby
        </span>
      )}
    </div>
  )
}

import { useState } from 'react'
import { disclosurePattern } from '@p/headless/patterns'

export const meta = {
  title: 'Disclosure',
  apg: 'disclosure',
  kind: 'pure' as const,
  blurb: 'Controlled boolean. aria-expanded · aria-controls · role="region" auto-wired.',
  keys: () => ['Enter', ' '],
}

export default function Demo() {
  const [open, setOpen] = useState(false)
  const { triggerProps, panelProps } = disclosurePattern({ open, onOpenChange: setOpen })

  return (
    <div className="space-y-3">
      <button
        {...triggerProps}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50 data-[state=open]:bg-stone-100"
      >
        {open ? 'Hide details' : 'Show details'}
      </button>
      <div {...panelProps} className="rounded-md border border-stone-200 bg-white p-3 text-sm text-stone-700">
        Disclosure panel content.
      </div>
    </div>
  )
}

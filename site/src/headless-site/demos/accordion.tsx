import { useState } from 'react'
import {
  accordionAxis,
  useAccordionPattern,
  type AccordionEvent,
  type AccordionItem,
} from '@p/headless/patterns'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Accordion',
  apg: 'accordion',
  kind: 'bundle' as const,
  blurb: 'N independent disclosures + header roving · click toggles · proper header/button nesting.',
  keys: () => dedupe(probe(accordionAxis())),
}

const initialItems: AccordionItem[] = [
  { id: 'a', label: 'What is @p/headless?' },
  { id: 'b', label: 'Why ARIA-first?' },
  { id: 'c', label: 'Bring my own styles?' },
]

export default function Demo() {
  const [items, setItems] = useState(initialItems)
  const dispatch = (e: AccordionEvent) => {
    if (e.type === 'expand') {
      setItems((xs) => xs.map((it) => (it.id === e.id ? { ...it, expanded: e.open } : it)))
    }
  }
  const { rootProps, headerProps, triggerProps, panelProps, items: rendered } =
    useAccordionPattern(items, dispatch)

  return (
    <div {...rootProps} className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
      {rendered.map((item) => (
        <div key={item.id}>
          <h3 {...headerProps(item.id)} className="m-0">
            <button
              {...triggerProps(item.id)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium hover:bg-stone-50"
            >
              {item.label}
              <span className="text-stone-400">{item.expanded ? '−' : '+'}</span>
            </button>
          </h3>
          <div {...panelProps(item.id)} className="px-3 py-2 text-sm text-stone-600 bg-stone-50">
            Body for <strong>{item.label}</strong>.
          </div>
        </div>
      ))}
    </div>
  )
}

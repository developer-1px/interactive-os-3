import { ROOT, type NormalizedData, type UiEvent } from '@p/headless'
import { useAccordionPattern } from '@p/headless/patterns'
import { useLocalData } from './_useLocalData'

export const meta = {
  title: 'Accordion',
  apg: 'accordion',
  kind: 'collection' as const,
  blurb: 'Roving + expand axis · proper header/button nesting · single or multiple expand.',
}

const initial: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT },
    a: { id: 'a', data: { label: 'What is @p/headless?' } },
    b: { id: 'b', data: { label: 'Why ARIA-first?' } },
    c: { id: 'c', data: { label: 'Bring my own styles?' } },
  },
  relationships: { [ROOT]: ['a', 'b', 'c'] },
}

export default function Demo() {
  const [data, onEvent] = useLocalData(initial)
  // accordion: click activates a header → toggle its expand state.
  // (the headless `expand` axis only fires on Arrow keys, not clicks)
  const onAccordionEvent = (e: UiEvent) => {
    if (e.type === 'activate') {
      const expandedIds = (data.entities.__expanded__?.data?.ids as string[]) ?? []
      const isOpen = expandedIds.includes(e.id)
      onEvent({ type: 'expand', id: e.id, open: !isOpen })
      return
    }
    onEvent(e)
  }
  const { rootProps, headerProps, triggerProps, panelProps, items } = useAccordionPattern(data, onAccordionEvent)

  return (
    <div {...rootProps} className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
      {items.map((item) => (
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

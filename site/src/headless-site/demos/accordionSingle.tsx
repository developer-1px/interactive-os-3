import { fromList } from '@p/headless'
import { accordionAxis, useAccordionPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Accordion · Single',
  apg: 'accordion',
  kind: 'collection' as const,
  blurb: '한 항목만 열림 — opts.mode="single" 로 패턴이 형제 자동 collapse 처리.',
  keys: () => dedupe(probe(accordionAxis())),
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() => fromList([
    { id: 'a', label: 'What is @p/headless?' },
    { id: 'b', label: 'Why ARIA-first?' },
    { id: 'c', label: 'Bring my own styles?' },
  ]))
  const { rootProps, headerProps, triggerProps, panelProps, items } =
    useAccordionPattern(data, onEvent, { mode: 'single' })

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

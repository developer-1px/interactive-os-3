import {
  activate,
  applyGesture,
  composeReducers,
  expand,
  expandOnActivate,
  navigate,
  reduce,
  ROOT,
  setValue,
  singleExpand,
  type NormalizedData,
} from '@p/headless'
import { useAccordionPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Accordion · Single',
  apg: 'accordion',
  kind: 'collection' as const,
  blurb: '한 항목만 열림 — singleExpand reducer 가 형제 자동 collapse 보장.',
  keys: () => dedupe([...probe(navigate('vertical')), ...probe(expand), ...probe(activate)]),
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

const accordionReducer = applyGesture(
  expandOnActivate,
  composeReducers(reduce, singleExpand, setValue),
)

export default function Demo() {
  const [data, onEvent] = useLocalData(initial, accordionReducer)
  const { rootProps, headerProps, triggerProps, panelProps, items } = useAccordionPattern(data, onEvent)

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

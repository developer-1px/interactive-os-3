import { fromList, getExpanded } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { disclosureAxis, disclosurePattern } from '@p/headless/patterns'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Disclosure',
  apg: 'disclosure',
  kind: 'single-value' as const,
  blurb: 'data 차원 — meta.expanded set 에서 open 읽음. activate→{expand} 직렬 emit. aria-expanded · aria-controls · role="region" 자동.',
  keys: () => dedupe(probe(disclosureAxis())),
}

const PANEL_ID = 'details'

export default function Demo() {
  const [data, onEvent] = useLocalData(() => fromList([{ id: PANEL_ID }]))
  const open = getExpanded(data).has(PANEL_ID)
  const { triggerProps, panelProps } = disclosurePattern(data, PANEL_ID, onEvent)

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

import { useState } from 'react'
import { getExpanded, reduce, type NormalizedData } from '@p/headless'
import { disclosurePattern } from '@p/headless/patterns'

export const meta = {
  title: 'Disclosure',
  apg: 'disclosure',
  kind: 'pure' as const,
  blurb: 'data 차원 — meta.expanded set 에서 open 읽음. activate→{expand} 직렬 emit. aria-expanded · aria-controls · role="region" 자동.',
  keys: () => ['Enter', ' '],
}

const PANEL_ID = 'details'
const initial: NormalizedData = {
  entities: { [PANEL_ID]: {} },
  relationships: {},
  meta: { root: [PANEL_ID] },
}

export default function Demo() {
  const [data, setData] = useState(initial)
  const open = getExpanded(data).has(PANEL_ID)
  const { triggerProps, panelProps } = disclosurePattern(data, PANEL_ID, (e) =>
    setData((d) => reduce(d, e)),
  )

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

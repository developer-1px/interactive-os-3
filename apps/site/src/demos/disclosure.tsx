import { fromList, isExpanded } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { disclosureAxis, disclosurePattern } from '@p/headless/patterns'
import { dedupe, probe } from '../catalog/keys'

export const meta = {
  title: 'Disclosure',
  apg: 'disclosure',
  kind: 'single-value' as const,
  blurb: 'A simple show-and-hide section backed by shared expanded state.',
  keys: () => dedupe(probe(disclosureAxis())),
}

const PANEL_ID = 'details'

export default function Demo() {
  const [data, onEvent] = useLocalData(() => fromList([{ id: PANEL_ID }]))
  const open = isExpanded(data, PANEL_ID)
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

import { fromList, isExpanded } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { disclosureAxis, disclosurePattern } from '@p/headless/patterns'
import { axisKeys } from '@p/headless'

export const meta = {
  title: 'Disclosure · Card',
  apg: 'disclosure',
  kind: 'single-value' as const,
  blurb: 'A product card that reveals additional details on demand.',
  keys: () => axisKeys(disclosureAxis()),
}

const ID = 'details'

export default function Demo() {
  const [data, onEvent] = useLocalData(() => fromList([{ id: ID }]))
  const open = isExpanded(data, ID)
  const { triggerProps, panelProps } = disclosurePattern(data, ID, onEvent)

  return (
    <article className="w-72 overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm">
      <div className="grid h-24 place-items-center bg-stone-100 text-3xl">📚</div>
      <div className="space-y-2 p-3 text-sm">
        <h3 className="font-medium">Designing Behavior</h3>
        <p className="text-stone-600">A short read on accessibility patterns.</p>
        <button
          {...triggerProps}
          className="text-xs text-stone-700 underline-offset-4 hover:underline"
        >
          {open ? 'Less detail' : 'More detail'}
        </button>
        <div {...panelProps} className="text-xs text-stone-500">
          Published 2026 · 142 pages · ISBN 978-1-2345-6789-0 · Available in EPUB and PDF.
        </div>
      </div>
    </article>
  )
}

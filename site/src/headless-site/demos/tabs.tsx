import { fromList } from '@p/headless'
import { tabsAxis, useTabsPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Tabs',
  apg: 'tabs',
  kind: 'collection' as const,
  blurb: 'Roving tabindex · automatic activation · Arrow / Home / End. tabProps(id) ↔ panelProps(id) auto-linked.',
  keys: () => dedupe(probe(tabsAxis())),
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() =>
    fromList([{ label: 'Overview', selected: true }, { label: 'Behavior' }, { label: 'Patterns' }]),
  )
  const { rootProps, tabProps, panelProps, items } = useTabsPattern(data, onEvent)

  return (
    <div className="space-y-3">
      <div {...rootProps} className="flex gap-1 border-b border-stone-200">
        {items.map((item) => (
          <button
            key={item.id}
            {...tabProps(item.id)}
            className="px-3 py-1.5 text-sm text-stone-600 border-b-2 border-transparent aria-selected:border-stone-900 aria-selected:text-stone-900 hover:text-stone-900"
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          {...panelProps(item.id)}
          className="rounded-md bg-stone-50 p-3 text-sm text-stone-700"
        >
          Panel: <strong>{item.label}</strong>
        </div>
      ))}
    </div>
  )
}

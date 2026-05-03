import { fromList } from '@p/headless'
import { toolbarAxis, useToolbarPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Toolbar',
  apg: 'toolbar',
  kind: 'collection' as const,
  blurb: 'role="toolbar" · single Tab stop · Arrow keys roam internal items · Enter/Space activate.',
  keys: () => dedupe(probe(toolbarAxis())),
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() =>
    fromList([
      { label: 'Bold' },
      { label: 'Italic' },
      { label: 'Underline' },
      { label: '|', separator: true, disabled: true },
      { label: 'Link' },
    ]),
  )
  const { rootProps, itemProps, items } = useToolbarPattern(data, onEvent)

  return (
    <div
      {...rootProps}
      aria-label="Formatting"
      className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white p-1 text-sm"
    >
      {items.map((item) =>
        item.separator ? (
          <span key={item.id} aria-hidden className="px-1 text-stone-300">
            |
          </span>
        ) : (
          <button
            key={item.id}
            {...itemProps(item.id)}
            className="rounded px-2 py-1 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-stone-900"
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  )
}

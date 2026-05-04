import { fromList } from '@p/headless'
import { toolbarAxis, useToolbarPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../catalog/keys'

export const meta = {
  title: 'Toolbar',
  apg: 'toolbar',
  kind: 'collection' as const,
  blurb: 'A compact command row that keeps related actions reachable in one place.',
  keys: () => dedupe(probe(toolbarAxis())),
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() => fromList([
    { id: 'bold', label: 'Bold' },
    { id: 'italic', label: 'Italic' },
    { id: 'underline', label: 'Underline' },
    { id: 'sep', separator: true },
    { id: 'link', label: 'Link' },
  ]))
  const { rootProps, toolbarItemProps, items } = useToolbarPattern(data, onEvent, { label: 'Formatting' })

  return (
    <div
      {...rootProps}
      className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white p-1 text-sm"
    >
      {items.map((item) => item.separator ? (
        <span key={item.id} aria-hidden className="px-1 text-stone-300">|</span>
      ) : (
        <button
          key={item.id}
          {...toolbarItemProps(item.id)}
          className="rounded px-2 py-1 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-stone-900"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

import { fromList } from '@p/headless'
import { menubarAxis, useMenubarPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../catalog/keys'

export const meta = {
  title: 'Menubar',
  apg: 'menubar',
  kind: 'collection' as const,
  blurb: 'role="menubar" · horizontal navigate at top level · sub-menus open vertical (cross-axis).',
  keys: () => dedupe(probe(menubarAxis())),
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() =>
    fromList([{ label: 'File' }, { label: 'Edit' }, { label: 'View' }, { label: 'Help' }]),
  )
  const { rootProps, menubarItemProps, items } = useMenubarPattern(data, onEvent)

  return (
    <div
      {...rootProps}
      aria-label="Application"
      className="inline-flex rounded-md border border-stone-200 bg-white text-sm"
    >
      {items.map((item) => (
        <button
          key={item.id}
          {...menubarItemProps(item.id)}
          className="px-3 py-1.5 hover:bg-stone-100 aria-selected:bg-stone-900 aria-selected:text-white first:rounded-l-md last:rounded-r-md"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

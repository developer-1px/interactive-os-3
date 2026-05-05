import { fromList } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { useMenuButtonPattern } from '@p/headless/patterns'

export const meta = {
  title: 'Menu Button',
  apg: 'menu-button',
  kind: 'collection' as const,
  blurb: 'Button that opens a menu — DOM focus moves to the menuitem (roving).',
  keys: () => ['ArrowDown', 'ArrowUp', 'Enter', 'Space', 'Home', 'End', 'Escape'],
}

const ITEMS = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete' },
]

export default function Demo() {
  const [data, onEvent] = useLocalData(() => fromList(ITEMS))
  const { triggerProps, menuProps, itemProps, items, open } = useMenuButtonPattern(data, onEvent)

  return (
    <div className="relative">
      <button
        {...triggerProps}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm hover:bg-stone-50"
      >
        Actions ▾
      </button>
      {open && (
        <ul
          {...menuProps}
          className="absolute left-0 top-full z-10 mt-1 w-40 rounded-md border border-stone-200 bg-white p-1 text-sm shadow-lg"
        >
          {items.map((item) => (
            <li
              key={item.id}
              {...itemProps(item.id)}
              className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 data-[active]:bg-stone-100 focus:bg-stone-900 focus:text-white focus:outline-none"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

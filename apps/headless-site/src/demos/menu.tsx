import { useState } from 'react'
import { activate, fromList, navigate } from '@p/headless'
import { useMenuPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Menu',
  apg: 'menu',
  kind: 'collection' as const,
  blurb: 'role="menu" · vertical Arrow nav · typeahead · activate emits via onEvent.',
  keys: () => dedupe([...probe(navigate('vertical')), ...probe(activate), 'A–Z']),
}

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [data, onEvent] = useLocalData(() =>
    fromList([{ label: 'New file' }, { label: 'Open…' }, { label: 'Save' }, { label: 'Close' }]),
  )
  const { rootProps, itemProps, items } = useMenuPattern(data, (e) => {
    onEvent(e)
    if (e.type === 'activate') setOpen(false)
  })

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
      >
        File ▾
      </button>
      {open && (
        <ul
          {...rootProps}
          className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md border border-stone-200 bg-white p-1 shadow-lg text-sm"
        >
          {items.map((item) => (
            <li
              key={item.id}
              {...itemProps(item.id)}
              className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 aria-disabled:opacity-50"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

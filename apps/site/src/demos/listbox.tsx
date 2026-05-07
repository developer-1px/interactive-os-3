import { fromList } from '@p/aria-kernel'
import { listboxAxis, useListboxPattern } from '@p/aria-kernel/patterns'
import { useLocalData } from '@p/aria-kernel/local'
import { axisKeys } from '@p/aria-kernel'

export const meta = {
  title: 'Listbox',
  apg: 'listbox',
  kind: 'collection' as const,
  blurb: 'A selectable list where one option represents the current value.',
  keys: () => axisKeys(listboxAxis()),
}

export default function ListboxDemo() {
  const [data, onEvent] = useLocalData(() =>
    fromList([{ label: 'Apple' }, { label: 'Banana' }, { label: 'Cherry' }, { label: 'Durian' }]),
  )
  const { rootProps, optionProps, items } = useListboxPattern(data, onEvent)

  return (
    <ul
      {...rootProps}
      aria-label="Fruits"
      className="w-56 rounded-md border border-stone-200 bg-white p-1 text-sm"
    >
      {items.map((item) => (
        <li
          key={item.id}
          {...optionProps(item.id)}
          className="cursor-pointer rounded px-2 py-1 [&:not([aria-selected=true])]:hover:bg-stone-200 aria-selected:bg-stone-900 aria-selected:text-white"
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}

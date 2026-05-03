import { fromList, reduceWithMultiSelect } from '@p/headless'
import { listboxAxis, useListboxPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Listbox · Multi',
  apg: 'listbox',
  kind: 'collection' as const,
  blurb: 'aria-multiselectable · Click/Space 토글 · Shift+Arrow 범위 · Ctrl/Meta+A 전체.',
  keys: () => dedupe(probe(listboxAxis({ multiSelectable: true }))),
}

export default function Demo() {
  const [data, onEvent] = useLocalData(
    () => fromList([
      { label: 'Apple' },
      { label: 'Banana' },
      { label: 'Cherry' },
      { label: 'Durian' },
      { label: 'Elderberry' },
    ]),
    reduceWithMultiSelect,
  )
  const { rootProps, optionProps, items } = useListboxPattern(data, onEvent, {
    multiSelectable: true,
  })

  return (
    <ul
      {...rootProps}
      aria-label="Fruits (multi-select)"
      className="w-56 rounded-md border border-stone-200 bg-white p-1 text-sm"
    >
      {items.map((item) => (
        <li
          key={item.id}
          {...optionProps(item.id)}
          className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 aria-selected:bg-stone-900 aria-selected:text-white"
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}

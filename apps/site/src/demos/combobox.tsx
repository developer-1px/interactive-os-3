import { fromList } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { comboboxAxis, useComboboxPattern, type ValuedPatternProps } from '@p/headless/patterns'
import { dedupe, probe } from '../catalog/keys'

export const meta = {
  title: 'Combobox',
  apg: 'combobox',
  kind: 'collection' as const,
  blurb: 'A searchable picker that keeps typed input and matching options together.',
  keys: () => dedupe(probe(comboboxAxis())),
}

const ALL = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Denmark', 'France', 'Germany', 'Japan']

/** wrapper 와 동일 props interface — InputPatternProps 그대로. */
export type ComboboxDemoProps = ValuedPatternProps<string>

export function ComboboxDemo({ data, value, onEvent, 'aria-label': ariaLabel }: ComboboxDemoProps) {
  const { comboboxProps, listboxProps, optionProps, items, expanded } =
    useComboboxPattern(data, onEvent, { label: ariaLabel, value })

  return (
    <div className="relative w-64">
      <input
        {...comboboxProps}
        placeholder="Search…"
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm"
      />
      {expanded && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-stone-200 bg-white shadow-lg">
          {items.length === 0 ? (
            <p className="px-2 py-1 text-xs text-stone-500">No matches</p>
          ) : (
            <ul {...listboxProps} className="max-h-48 overflow-auto p-1 text-sm">
              {items.map((item) => (
                <li
                  key={item.id}
                  {...optionProps(item.id)}
                  className="cursor-pointer rounded px-2 py-1 hover:bg-stone-100 data-[active]:bg-stone-100 aria-selected:bg-stone-900 aria-selected:text-white"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() => fromList(ALL.map((label) => ({ label }))))
  return <ComboboxDemo data={data} onEvent={onEvent} aria-label="Country" />
}

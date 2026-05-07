import { fromList, reduceWithRadio } from '@p/headless'
import { radioGroupKeys, useRadioGroupPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'

export const meta = {
  title: 'Radio Group',
  apg: 'radio',
  kind: 'collection' as const,
  blurb: 'A compact choice set where moving between options updates the selected value.',
  keys: () => radioGroupKeys(),
}

export default function RadioGroupDemo() {
  const [data, onEvent] = useLocalData(
    () => fromList([{ label: 'Small' }, { label: 'Medium', checked: true }, { label: 'Large' }]),
    reduceWithRadio,
  )
  const { rootProps, radioProps, items } = useRadioGroupPattern(data, onEvent)

  return (
    <div {...rootProps} aria-label="Size" className="flex flex-col gap-2">
      {items.map((item) => (
        <label
          key={item.id}
          {...radioProps(item.id)}
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <span aria-hidden className="h-4 w-4 rounded-full border-2 border-stone-400 grid place-items-center">
            {item.selected && <span className="h-2 w-2 rounded-full bg-stone-900" />}
          </span>
          {item.label}
        </label>
      ))}
    </div>
  )
}

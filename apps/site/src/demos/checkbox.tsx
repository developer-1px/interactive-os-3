import { axisKeys, toggle } from '@p/headless'
import { useLocalValue } from '@p/headless/local'
import { checkboxPattern, type CheckboxState } from '@p/headless/patterns'

export const meta = {
  title: 'Checkbox',
  apg: 'checkbox',
  kind: 'collection' as const,
  blurb: 'Two-state checkbox built on a button — toggle with Space.',
  keys: () => axisKeys(toggle),
}

export default function Demo() {
  const [checked, dispatch] = useLocalValue<CheckboxState>(false)
  const { checkboxProps } = checkboxPattern(checked, dispatch, {
    label: 'Subscribe to newsletter',
  })

  return (
    <label className="flex w-fit items-center gap-2 text-sm">
      <button
        {...checkboxProps}
        className="grid h-5 w-5 place-items-center rounded border border-stone-300 bg-white aria-checked:border-stone-900 aria-checked:bg-stone-900 aria-checked:text-white"
      >
        {checked === true ? '✓' : checked === 'mixed' ? '–' : ''}
      </button>
      <span>Subscribe to newsletter</span>
    </label>
  )
}

import { useLocalValue } from '@p/headless/local'
import { switchAxis, switchPattern } from '@p/headless/patterns'
import { axisKeys } from '@p/headless'

export const meta = {
  title: 'Switch · div',
  apg: 'switch',
  kind: 'single-value' as const,
  blurb: 'role="switch" applied to a <div> — same hook, different host element.',
  keys: () => axisKeys(switchAxis()),
}

export default function Demo() {
  const [on, dispatch] = useLocalValue(true)
  const { switchProps } = switchPattern(on, dispatch, { label: 'Sound' })

  return (
    <label className="flex items-center gap-3 text-sm">
      <span>Sound</span>
      <div
        {...switchProps}
        tabIndex={0}
        className="relative h-6 w-11 cursor-pointer rounded-full bg-stone-300 transition data-[state=on]:bg-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
      >
        <span
          aria-hidden
          data-state={on ? 'on' : 'off'}
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform data-[state=on]:translate-x-5"
        />
      </div>
    </label>
  )
}

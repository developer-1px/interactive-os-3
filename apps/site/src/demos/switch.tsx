import { useLocalValue } from '@p/headless/local'
import { switchAxis, switchPattern } from '@p/headless/patterns'
import { axisKeys } from '@p/headless'

export const meta = {
  title: 'Switch',
  apg: 'switch',
  kind: 'single-value' as const,
  blurb: 'A binary control for turning a setting on or off.',
  keys: () => axisKeys(switchAxis()),
}

export default function Demo() {
  const [on, dispatch] = useLocalValue(false)
  const { switchProps } = switchPattern(on, dispatch, { label: 'Notifications' })

  return (
    <div className="flex items-center gap-3">
      <button
        {...switchProps}
        className="relative h-6 w-11 rounded-full bg-stone-300 transition data-[state=on]:bg-emerald-600"
      >
        <span
          aria-hidden
          data-state={on ? 'on' : 'off'}
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform data-[state=on]:translate-x-5"
        />
      </button>
      <span className="text-sm text-stone-700">{on ? 'On' : 'Off'}</span>
    </div>
  )
}

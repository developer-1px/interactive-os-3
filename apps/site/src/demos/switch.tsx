import { useLocalValue } from '@p/headless/local'
import { switchAxis, switchPattern } from '@p/headless/patterns'
import { dedupe, probe } from '../catalog/keys'

export const meta = {
  title: 'Switch',
  apg: 'switch',
  kind: 'single-value' as const,
  blurb: 'role="switch" · Space/Enter activate. 단일 boolean — useLocalValue 한 줄.',
  keys: () => dedupe(probe(switchAxis())),
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

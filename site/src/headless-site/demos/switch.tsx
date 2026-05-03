import type { NormalizedData } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { switchAxis, toggleSwitchPattern } from '@p/headless/patterns'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Switch',
  apg: 'switch',
  kind: 'pure' as const,
  blurb: 'role="switch" · Space/Enter activate. data 차원 — entity.checked SSoT, activate→{value} 직렬 emit.',
  keys: () => dedupe(probe(switchAxis())),
}

const SWITCH_ID = 'notif'
const initial: NormalizedData = {
  entities: {
    [SWITCH_ID]: { value: false, label: 'Notifications' },
  },
  relationships: {},
  meta: { root: [SWITCH_ID] },
}

export default function Demo() {
  const [data, onEvent] = useLocalData(initial)
  const on = Boolean(data.entities[SWITCH_ID]?.value)
  const { switchProps } = toggleSwitchPattern(data, SWITCH_ID, onEvent, { label: 'Notifications' })

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

import { useState } from 'react'
import { ROOT, reduce, type NormalizedData } from '@p/headless'
import { toggleSwitchPattern } from '@p/headless/patterns'

export const meta = {
  title: 'Switch',
  apg: 'switch',
  kind: 'pure' as const,
  blurb: 'role="switch" · Space/Enter activate. data 차원 — entity.checked SSoT, activate→{value} 직렬 emit.',
  keys: () => ['Enter', ' '],
}

const SWITCH_ID = 'notif'
const initial: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT },
    [SWITCH_ID]: { id: SWITCH_ID, data: { checked: false, label: 'Notifications' } },
  },
  relationships: { [ROOT]: [SWITCH_ID] },
}

export default function Demo() {
  const [data, setData] = useState(initial)
  const on = Boolean(data.entities[SWITCH_ID]?.data?.checked)
  const { switchProps } = toggleSwitchPattern(data, SWITCH_ID, (e) => {
    if (e.type === 'value') {
      setData((d) => ({
        ...d,
        entities: {
          ...d.entities,
          [SWITCH_ID]: {
            ...d.entities[SWITCH_ID]!,
            data: { ...(d.entities[SWITCH_ID]!.data ?? {}), checked: e.value },
          },
        },
      }))
    } else {
      setData((d) => reduce(d, e))
    }
  }, { label: 'Notifications' })

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

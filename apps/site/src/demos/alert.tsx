import { useState } from 'react'
import { alertPattern } from '@p/headless/patterns'

export const meta = {
  title: 'Alert',
  apg: 'alert',
  kind: 'overlay' as const,
  blurb: 'role="alert" — assistive tech announces inserted/changed content immediately.',
  keys: () => [],
}

export default function Demo() {
  const [count, setCount] = useState(0)
  const { rootProps } = alertPattern()

  return (
    <div className="space-y-3">
      <button
        onClick={() => setCount((c) => c + 1)}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
      >
        Trigger alert
      </button>
      {count > 0 && (
        <div
          {...rootProps}
          key={count}
          className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
        >
          ⚠ Alert #{count} — your session will expire in 60s.
        </div>
      )}
    </div>
  )
}

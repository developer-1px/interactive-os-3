import { useState } from 'react'

export const meta = {
  title: 'Button',
  apg: 'button',
  kind: 'collection' as const,
  blurb: 'Native <button> as command vs toggle (aria-pressed).',
  keys: () => ['Enter', 'Space'],
}

export default function ButtonDemo() {
  const [count, setCount] = useState(0)
  const [muted, setMuted] = useState(false)
  const [bold, setBold] = useState(true)

  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="space-y-1">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Command</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCount((n) => n + 1)}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
          >
            Increment
          </button>
          <span className="text-stone-600">count: {count}</span>
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">Toggle (aria-pressed)</span>
        <div className="flex gap-2">
          <button
            type="button"
            aria-pressed={muted}
            onClick={() => setMuted((p) => !p)}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 aria-pressed:bg-stone-900 aria-pressed:text-white aria-pressed:border-stone-900"
          >
            {muted ? '🔇 Muted' : '🔊 Sound'}
          </button>
          <button
            type="button"
            aria-pressed={bold}
            onClick={() => setBold((p) => !p)}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 font-bold aria-pressed:bg-stone-900 aria-pressed:text-white aria-pressed:border-stone-900"
          >
            B
          </button>
        </div>
      </div>
    </div>
  )
}

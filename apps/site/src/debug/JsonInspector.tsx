import { useSyncExternalStore } from 'react'

interface Subscribable<T> {
  toJson: () => T
  subscribe: (notify: () => void) => () => void
}

interface Props {
  title: string
  source?: Subscribable<unknown>
  value?: unknown
}

/** JsonInspector — JSON debug 패널. source(subscribe 가능) 또는 value(정적) 받음. */
export function JsonInspector({ title, source, value }: Props) {
  const live = source ? useSyncExternalStore(source.subscribe, source.toJson) : value
  return (
    <section className="flex-1 overflow-auto p-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
      <pre className="whitespace-pre font-mono text-xs leading-relaxed text-neutral-800">{JSON.stringify(live, null, 2)}</pre>
    </section>
  )
}

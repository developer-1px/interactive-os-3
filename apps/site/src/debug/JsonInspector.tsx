import { useCallback, useRef, useSyncExternalStore } from 'react'

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
  // toJson 이 매번 새 객체를 반환하므로 useSyncExternalStore 가 무한 루프에 빠짐.
  // subscribe notify 가 올 때만 캐시 무효화 → cached snapshot 반환.
  const cacheRef = useRef<{ data: unknown } | null>(null)
  const subscribe = useCallback(
    (notify: () => void) => {
      if (!source) return () => {}
      return source.subscribe(() => { cacheRef.current = null; notify() })
    },
    [source],
  )
  const getSnapshot = useCallback(() => {
    if (!source) return undefined
    if (!cacheRef.current) cacheRef.current = { data: source.toJson() }
    return cacheRef.current.data
  }, [source])
  const live = source ? useSyncExternalStore(subscribe, getSnapshot) : value
  return (
    <section className="flex-1 overflow-auto p-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
      <pre className="whitespace-pre font-mono text-xs leading-relaxed text-neutral-800">{JSON.stringify(live, null, 2)}</pre>
    </section>
  )
}

import { defineResource, useResource } from '@p/headless/data'

/** Resource + useResource 라이브 데모 — 카운터 in-memory store. */
const counterResource = defineResource<number>({
  key: () => 'demo-counter',
  initial: 0,
})

export function FlowDemo() {
  const [value, dispatch] = useResource(counterResource)
  return (
    <div role="group" aria-label="Resource 데모">
      <button type="button" onClick={() => dispatch({ type: 'set', value: (value ?? 0) - 1 })}>−</button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => dispatch({ type: 'set', value: (value ?? 0) + 1 })}>+</button>
      <button type="button" onClick={() => dispatch({ type: 'invalidate' })}>reset</button>
    </div>
  )
}

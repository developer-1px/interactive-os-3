import { useRovingDOM } from '@p/headless/roving/useRovingDOM'

/** useRovingDOM 라이브 데모 — 4개 button을 horizontal roving. */
export function RovingDemo() {
  const { ref, onKeyDown } = useRovingDOM<HTMLDivElement>(null, { orientation: 'horizontal' })
  return (
    <div ref={ref} onKeyDown={onKeyDown} role="toolbar" aria-label="Roving 데모">
      <button type="button">A</button>
      <button type="button">B</button>
      <button type="button">C</button>
      <button type="button">D</button>
    </div>
  )
}

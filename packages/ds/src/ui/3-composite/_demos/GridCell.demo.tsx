import { useRovingDOM } from '@p/headless/roving/useRovingDOM'
import { GridCell } from '../GridCell'
export default () => {
  const { ref, onKeyDown } = useRovingDOM<HTMLTableElement>(null, {
    orientation: 'both',
    itemSelector: '[role="columnheader"], [role="rowheader"], [role="gridcell"], [role="row"]',
  })
  return (
    <table ref={ref} onKeyDown={onKeyDown} role="grid">
      <tbody><tr><GridCell>cell value</GridCell></tr></tbody>
    </table>
  )
}

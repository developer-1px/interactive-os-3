import { useRovingDOM } from '@p/headless/roving/useRovingDOM'
import { DataGridRow } from '../DataGridRow'
import { GridCell } from '../GridCell'
export default () => {
  const { ref, onKeyDown } = useRovingDOM<HTMLTableElement>(null, {
    orientation: 'both',
    itemSelector: '[role="columnheader"], [role="rowheader"], [role="gridcell"], [role="row"]',
  })
  return (
    <table ref={ref} onKeyDown={onKeyDown} role="grid">
      <tbody>
        <DataGridRow>
          <GridCell>row cell A</GridCell>
          <GridCell>row cell B</GridCell>
        </DataGridRow>
      </tbody>
    </table>
  )
}

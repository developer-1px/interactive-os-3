import { useSpatialNavigation } from '@p/headless/roving/useSpatialNavigation'
import { DataGridRow } from '../DataGridRow'
import { GridCell } from '../GridCell'
export default () => {
  const { ref, onKeyDown } = useSpatialNavigation<HTMLTableElement>(null, {
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

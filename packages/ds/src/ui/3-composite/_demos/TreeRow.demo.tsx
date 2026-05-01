import { useSpatialNavigation } from '@p/headless/roving/useSpatialNavigation'
import { TreeRow } from '../TreeRow'
import { GridCell } from '../GridCell'
export default () => {
  const { ref, onKeyDown } = useSpatialNavigation<HTMLTableElement>(null, {
    orientation: 'both',
    itemSelector: '[role="row"], [role="gridcell"], [role="columnheader"], [role="rowheader"]',
  })
  return (
    <table ref={ref} onKeyDown={onKeyDown} role="treegrid">
      <tbody>
        <TreeRow level={1}><GridCell>Tree row</GridCell></TreeRow>
      </tbody>
    </table>
  )
}

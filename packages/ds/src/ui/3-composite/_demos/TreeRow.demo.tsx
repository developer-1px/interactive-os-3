import { useRovingDOM } from '@p/headless/roving/useRovingDOM'
import { TreeRow } from '../TreeRow'
import { GridCell } from '../GridCell'
export default () => {
  const { ref, onKeyDown } = useRovingDOM<HTMLTableElement>(null, {
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

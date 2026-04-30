import { useRovingDOM } from '@p/headless/roving/useRovingDOM'
import { RowGroup } from '../RowGroup'
export default () => {
  const { ref, onKeyDown } = useRovingDOM<HTMLTableElement>(null, {
    orientation: 'both',
    itemSelector: '[role="columnheader"], [role="rowheader"], [role="gridcell"], [role="row"]',
  })
  return (
    <table ref={ref} onKeyDown={onKeyDown} role="grid">
      <RowGroup>
        <tr role="row"><td role="gridcell">row in group</td></tr>
      </RowGroup>
    </table>
  )
}

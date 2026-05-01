import { useSpatialNavigation } from '@p/headless/roving/useSpatialNavigation'
import { ColumnHeader } from '../ColumnHeader'
export default () => {
  const { ref, onKeyDown } = useSpatialNavigation<HTMLTableElement>(null, {
    orientation: 'both',
    itemSelector: '[role="columnheader"], [role="rowheader"], [role="gridcell"], [role="row"]',
  })
  return (
    <table ref={ref} onKeyDown={onKeyDown} role="grid">
      <thead>
        <tr>
          <ColumnHeader sort="ascending">Name</ColumnHeader>
          <ColumnHeader>Role</ColumnHeader>
        </tr>
      </thead>
    </table>
  )
}

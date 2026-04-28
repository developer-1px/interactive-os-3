import { TreeGrid } from '../TreeGrid'
import { TreeRow } from '../TreeRow'
import { ColumnHeader } from '../ColumnHeader'
import { GridCell } from '../GridCell'
export default () => (
  <TreeGrid>
    <thead>
      <tr><ColumnHeader>Name</ColumnHeader></tr>
    </thead>
    <tbody>
      <TreeRow level={1}><GridCell>Root</GridCell></TreeRow>
      <TreeRow level={2}><GridCell>Child</GridCell></TreeRow>
    </tbody>
  </TreeGrid>
)

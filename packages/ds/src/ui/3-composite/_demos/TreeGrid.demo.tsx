import { TreeGrid } from '../TreeGrid'
import { TreeItem } from '../TreeItem'
import { ColumnHeader } from '../ColumnHeader'
import { GridCell } from '../GridCell'
export default () => (
  <TreeGrid>
    <thead>
      <tr><ColumnHeader>Name</ColumnHeader></tr>
    </thead>
    <tbody>
      <TreeItem level={1}><GridCell>Root</GridCell></TreeItem>
      <TreeItem level={2}><GridCell>Child</GridCell></TreeItem>
    </tbody>
  </TreeGrid>
)

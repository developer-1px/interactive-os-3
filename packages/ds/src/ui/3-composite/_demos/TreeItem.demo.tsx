import { TreeItem } from '../TreeItem'
import { GridCell } from '../GridCell'
export default () => (
  <table role="treegrid">
    <tbody>
      <TreeItem level={1}><GridCell>Tree row</GridCell></TreeItem>
    </tbody>
  </table>
)

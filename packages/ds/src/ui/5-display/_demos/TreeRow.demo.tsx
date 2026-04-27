import { TreeRow } from '../TreeRow'
import { GridCell } from '../GridCell'
export default () => (
  <table role="treegrid">
    <tbody>
      <TreeRow level={1}><GridCell>Tree row</GridCell></TreeRow>
    </tbody>
  </table>
)

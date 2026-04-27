import { DataGridRow } from '../DataGridRow'
import { GridCell } from '../GridCell'
export default () => (
  <table role="grid">
    <tbody>
      <DataGridRow>
        <GridCell>row cell A</GridCell>
        <GridCell>row cell B</GridCell>
      </DataGridRow>
    </tbody>
  </table>
)

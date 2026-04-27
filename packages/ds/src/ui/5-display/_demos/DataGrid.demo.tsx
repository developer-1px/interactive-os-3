import { DataGrid } from '../DataGrid'
import { ColumnHeader } from '../ColumnHeader'
import { GridCell } from '../GridCell'
export default () => (
  <DataGrid>
    <thead>
      <tr><ColumnHeader>Name</ColumnHeader><ColumnHeader>Age</ColumnHeader></tr>
    </thead>
    <tbody>
      <tr><GridCell>Jane</GridCell><GridCell>30</GridCell></tr>
      <tr><GridCell>John</GridCell><GridCell>28</GridCell></tr>
    </tbody>
  </DataGrid>
)

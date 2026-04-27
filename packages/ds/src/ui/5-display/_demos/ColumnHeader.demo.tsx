import { ColumnHeader } from '../ColumnHeader'
export default () => (
  <table role="grid">
    <thead>
      <tr>
        <ColumnHeader sort="ascending">Name</ColumnHeader>
        <ColumnHeader>Role</ColumnHeader>
      </tr>
    </thead>
  </table>
)

import { Table } from '../Table'
export default () => (
  <Table
    columns={[
      { id: 'name', label: 'Name' },
      { id: 'role', label: 'Role' },
    ]}
    rows={[
      { id: 1, name: 'Jane', role: 'Eng' },
      { id: 2, name: 'John', role: 'Design' },
    ]}
  />
)

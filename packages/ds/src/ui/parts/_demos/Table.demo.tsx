import { Table } from '../Table'
export default () => (
  <Table
    columns={[
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
    ]}
    rows={[
      { name: 'Jane', role: 'Eng' },
      { name: 'John', role: 'Design' },
    ]}
  />
)

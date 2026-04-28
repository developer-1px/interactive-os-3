import { Sheet } from '../Sheet'
const empty = { entities: { __root__: { id: '__root__', data: {} } }, relationships: { __root__: [] } }
export default () => (
  <Sheet data={empty} onEvent={() => {}}>
    <div style={{ font: '500 11px system-ui', color: '#666', padding: 8 }}>Sheet (open in app)</div>
  </Sheet>
)

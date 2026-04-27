import { Dialog } from '../Dialog'
const empty = { entities: { __root__: { id: '__root__', data: {} } }, relationships: { __root__: [] } }
export default () => (
  <Dialog data={empty} onEvent={() => {}}>
    <div style={{ font: '500 11px system-ui', color: '#666', padding: 8 }}>Dialog (open in app)</div>
  </Dialog>
)

import { SidebarAdminFloating } from '../adminFloating'
import { ROOT, type NormalizedData } from '../../../headless/types'

const tree: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    a: { id: 'a', data: { label: 'Dashboard' } },
    b: { id: 'b', data: { label: 'Users' } },
    c: { id: 'c', data: { label: 'Settings' } },
  },
  relationships: { [ROOT]: ['a', 'b', 'c'] },
}

export default () => (
  <SidebarAdminFloating
    id="demo.sidebar"
    label="Admin sidebar"
    brand="Admin"
    tree={tree}
    onEvent={() => {}}
  />
)

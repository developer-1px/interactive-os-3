import { Breadcrumb } from '../Breadcrumb'
export default () => (
  <Breadcrumb
    items={[
      { id: 'home', label: 'Home' },
      { id: 'docs', label: 'Docs' },
      { id: 'tokens', label: 'Tokens' },
    ]}
  />
)

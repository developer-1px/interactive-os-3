import { PhoneTabBar } from '../Phone'
export default () => (
  <PhoneTabBar
    active="home"
    items={[
      { id: 'home', label: 'Home' },
      { id: 'search', label: 'Search' },
    ]}
  />
)

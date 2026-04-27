import { PhoneTabBar } from '../PhoneTabBar'
export default () => (
  <PhoneTabBar
    active="home"
    items={[
      { id: 'home', label: 'Home' },
      { id: 'search', label: 'Search' },
    ]}
  />
)

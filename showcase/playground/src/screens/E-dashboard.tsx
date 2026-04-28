import { BarChart, Phone, PhoneTabBar, PhoneTopBar, Row, StatCard, TabList, Top10List, fromList } from '@p/ds'
import { defineScreen, defineGroup } from '../wireframe-registry'
import { Body, tabIcons } from '../wireframe-shell'

defineGroup('E-Dashboard',     { id: 'E', title: 'Dashboard',     lede: 'StatCard 2×2 KPI grid + BarChart 주간 트래픽 + Top10List 라우트별 인기.', defaultGuide: 'grid' })

// ──────────────────────────────────────────────────────────────────────
// (E) Dashboard — StatCard · BarChart · Top10List
// ──────────────────────────────────────────────────────────────────────

const Dash_Overview = defineScreen({
  id: 'cat-dash-overview',
  app: 'Stripe Dashboard',
  flow: 'dashboard',
  category: 'E-Dashboard',
  patterns: ['period-tabs', 'kpi-grid', 'bar-chart', 'bottom-tab-bar'],
  parts: ['Phone', 'PhoneTopBar', 'PhoneTabBar', 'TabList', 'StatCard', 'BarChart', 'Row'],
  render: () => (
    <Phone
      label="dashboard"
      topBar={<PhoneTopBar title="Dashboard" action={<span data-icon="more" aria-label="more" />} />}
      bottomBar={<PhoneTabBar items={tabIcons(3)} active={3} />}
    >
      <Body>
        <TabList
          aria-label="period"
          data={fromList([
            { label: 'D' }, { label: 'W', selected: true }, { label: 'M' }, { label: '3M' },
          ])}
          onEvent={() => {}}
        />
        <Row flow="cluster" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <StatCard label="MAU" value="12,438" change="+8.2%" changeDir="up" />
          <StatCard label="Errors" value="3.4%" change="+2.1%" changeDir="up" variant="alert" />
          <StatCard label="Revenue" value="₩48.2M" change="+12%" changeDir="up" />
          <StatCard label="Latency" value="120ms" change="-8ms" changeDir="down" />
        </Row>
        <BarChart
          aria-label="weekly traffic"
          caption={<small>주간 트래픽</small>}
          data={fromList([
            { label: 'Mon', value: '8.2k', pct: 65 },
            { label: 'Tue', value: '9.1k', pct: 72 },
            { label: 'Wed', value: '12.4k', pct: 98 },
            { label: 'Thu', value: '10.8k', pct: 85 },
            { label: 'Fri', value: '11.2k', pct: 88 },
            { label: 'Sat', value: '6.4k', pct: 50 },
            { label: 'Sun', value: '5.8k', pct: 46 },
          ])}
        />
      </Body>
    </Phone>
  ),
})

const Dash_Top = defineScreen({
  id: 'cat-dash-top',
  app: 'Stripe Dashboard',
  flow: 'dashboard',
  category: 'E-Dashboard',
  patterns: ['top-n-list', 'top-bar-back'],
  parts: ['Phone', 'PhoneTopBar', 'Top10List'],
  render: () => (
    <Phone
      label="top routes"
      topBar={<PhoneTopBar back title="Top routes" />}
    >
      <Body>
        <Top10List
          aria-label="top routes by traffic"
          data={fromList([
            { label: '/feed', count: '12,438' },
            { label: '/dashboard', count: '8,221' },
            { label: '/shop', count: '6,109' },
            { label: '/courses', count: '4,820' },
            { label: '/messages', count: '3,945' },
            { label: '/profile', count: '2,810' },
            { label: '/settings', count: '1,932' },
            { label: '/help', count: '1,204' },
            { label: '/onboarding', count: '892' },
            { label: '/about', count: '420' },
          ])}
        />
      </Body>
    </Phone>
  ),
})

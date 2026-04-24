import { ROOT, fromList, type NormalizedData } from '../../../ds'
import { RANGES, kpis, regionBars, sources, weekBars, type Range } from './data'

export interface AnalyticsState { range: Range; setRange: (r: Range) => void }

export function buildAnalyticsPage(s: AnalyticsState): NormalizedData {
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'form' } },
      hdr: { id: 'hdr', data: { type: 'Header', flow: 'split' } },
      title: { id: 'title', data: { type: 'Text', variant: 'h1', content: 'Analytics' } },
      rangeBar: { id: 'rangeBar', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '기간' } } },
      ...Object.fromEntries(RANGES.map((r) => [`r-${r}`, { id: `r-${r}`, data: {
        type: 'Ui', component: 'ToolbarButton',
        props: { pressed: s.range === r, onClick: () => s.setRange(r), 'aria-label': r },
        content: r === 'custom' ? '사용자 지정' : r,
      } }])),
      kpis: { id: 'kpis', data: { type: 'Grid', cols: 4, flow: 'form' } },
      ...Object.fromEntries(kpis.map((k) => [`kpi-${k.id}`, { id: `kpi-${k.id}`, data: {
        type: 'Ui', component: 'StatCard',
        props: {
          label: k.label, value: k.value, change: k.change, changeDir: k.dir,
          icon: <span data-icon={k.icon} aria-hidden="true" />,
          tone: k.tone ?? 'normal', 'aria-label': k.label,
        },
      } }])),
      chartsGrid: { id: 'chartsGrid', data: { type: 'Grid', cols: 2, flow: 'form' } },
      trafficSec: { id: 'trafficSec', data: { type: 'Section', heading: { content: '주간 트래픽' }, emphasis: 'raised' } },
      trafficChart: { id: 'trafficChart', data: { type: 'Ui', component: 'BarChart', props: { caption: '일일 방문 수', data: fromList(weekBars) } } },
      sourceSec: { id: 'sourceSec', data: { type: 'Section', heading: { content: '유입 채널 Top 5' }, emphasis: 'raised' } },
      sourceList: { id: 'sourceList', data: { type: 'Ui', component: 'Top10List', props: { data: fromList(sources) } } },
      regionSec: { id: 'regionSec', data: { type: 'Section', heading: { content: '지역별 활성 사용자' }, emphasis: 'raised' } },
      regionChart: { id: 'regionChart', data: { type: 'Ui', component: 'BarChart', props: { caption: '단위: 명', data: fromList(regionBars) } } },
      gapNote: { id: 'gapNote', data: { type: 'Text', variant: 'small',
        content: '※ 갭: LineChart/DonutChart/AreaChart · DateRangePicker · Drilldown 부재.' } },
    },
    relationships: {
      [ROOT]: ['page'], page: ['hdr', 'kpis', 'chartsGrid', 'regionSec', 'gapNote'],
      hdr: ['title', 'rangeBar'],
      rangeBar: RANGES.map((r) => `r-${r}`),
      kpis: kpis.map((k) => `kpi-${k.id}`),
      chartsGrid: ['trafficSec', 'sourceSec'],
      trafficSec: ['trafficChart'], sourceSec: ['sourceList'],
      regionSec: ['regionChart'],
    },
  }
}

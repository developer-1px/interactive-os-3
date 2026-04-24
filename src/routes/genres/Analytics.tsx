/**
 * Analytics v2 — 차트 확장 대시보드.
 *
 * 현재 ds는 BarChart만 제공 → LineChart/DonutChart/AreaChart 갭.
 * DateRangePicker / Drilldown 도 갭. 일단 StatCard + BarChart + Top10List로 조립.
 */
import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../ds'

const kpis = [
  { id: 'rev',   label: '매출',      value: '$128,430', change: '+12.4%', dir: 'up'   as const, icon: 'dollar' },
  { id: 'usr',   label: '활성 사용자', value: '42,180',  change:  '+8.1%', dir: 'up'   as const, icon: 'users'  },
  { id: 'conv',  label: '전환율',     value: '4.82%',   change:  '-0.3%', dir: 'down' as const, icon: 'chart'  },
  { id: 'churn', label: '이탈률',     value: '2.14%',   change:  '+0.1%', dir: 'up'   as const, icon: 'alert', tone: 'alert' as const },
]

const bars = [
  { label: '월',  value: 420, pct:  70, tone: 'info'    as const },
  { label: '화',  value: 380, pct:  63, tone: 'info'    as const },
  { label: '수',  value: 520, pct:  87, tone: 'info'    as const },
  { label: '목',  value: 600, pct: 100, tone: 'success' as const },
  { label: '금',  value: 480, pct:  80, tone: 'info'    as const },
  { label: '토',  value: 210, pct:  35, tone: 'neutral' as const },
  { label: '일',  value: 180, pct:  30, tone: 'neutral' as const },
]

const sources = [
  { label: 'Organic',   count: '18,420 (44%)' },
  { label: 'Direct',    count: '12,080 (29%)' },
  { label: 'Paid',      count:  '6,280 (15%)' },
  { label: 'Referral',  count:  '3,400 (8%)'  },
  { label: 'Social',    count:  '1,700 (4%)'  },
]

export function Analytics() {
  const [range, setRange] = useState<'7d' | '30d' | '90d' | 'custom'>('7d')

  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'form' } },

      hdr: { id: 'hdr', data: { type: 'Header', flow: 'split' } },
      title: { id: 'title', data: { type: 'Text', variant: 'h1', content: 'Analytics' } },
      rangeBar: { id: 'rangeBar', data: { type: 'Ui', component: 'Toolbar', props: { 'aria-label': '기간' } } },
      ...Object.fromEntries((['7d','30d','90d','custom'] as const).map((r) => [
        `r-${r}`, { id: `r-${r}`, data: {
          type: 'Ui', component: 'ToolbarButton',
          props: { pressed: range === r, onClick: () => setRange(r), 'aria-label': r },
          content: r === 'custom' ? '사용자 지정' : r,
        } },
      ])),

      /* KPI row */
      kpis: { id: 'kpis', data: { type: 'Grid', cols: 4, flow: 'form' } },
      ...Object.fromEntries(kpis.map((k) => [
        `kpi-${k.id}`, { id: `kpi-${k.id}`, data: {
          type: 'Ui', component: 'StatCard',
          props: {
            label: k.label, value: k.value, change: k.change, changeDir: k.dir,
            icon: <span data-icon={k.icon} aria-hidden="true" />,
            tone: (k as { tone?: 'alert' }).tone ?? 'normal',
            'aria-label': k.label,
          },
        } },
      ])),

      /* Charts row */
      chartsGrid: { id: 'chartsGrid', data: { type: 'Grid', cols: 2, flow: 'form' } },
      trafficSec: { id: 'trafficSec', data: { type: 'Section', heading: { content: '주간 트래픽' }, emphasis: 'raised' } },
      trafficChart: { id: 'trafficChart', data: {
        type: 'Ui', component: 'BarChart',
        props: { caption: '일일 방문 수 (천 명)', bars },
      } },
      sourceSec: { id: 'sourceSec', data: { type: 'Section', heading: { content: '유입 채널 Top 5' }, emphasis: 'raised' } },
      sourceList: { id: 'sourceList', data: {
        type: 'Ui', component: 'Top10List',
        props: { entries: sources },
      } },

      /* 사용자 지역 (bar 재활용) */
      regionSec: { id: 'regionSec', data: { type: 'Section', heading: { content: '지역별 활성 사용자' }, emphasis: 'raised' } },
      regionChart: { id: 'regionChart', data: {
        type: 'Ui', component: 'BarChart',
        props: {
          caption: '단위: 명',
          bars: [
            { label: '서울',   value: 18200, pct: 100, tone: 'info' },
            { label: '부산',   value:  6400, pct:  35, tone: 'info' },
            { label: '대구',   value:  3800, pct:  21, tone: 'info' },
            { label: '인천',   value:  3200, pct:  18, tone: 'neutral' },
            { label: '기타',   value:  10580,pct:  58, tone: 'success' },
          ],
        },
      } },

      gapNote: { id: 'gapNote', data: { type: 'Text', variant: 'small',
        content: '※ 갭: LineChart/DonutChart/AreaChart 및 DateRangePicker 부재. Drilldown도 없음.' } },
    },
    relationships: {
      [ROOT]: ['page'],
      page: ['hdr', 'kpis', 'chartsGrid', 'regionSec', 'gapNote'],

      hdr: ['title', 'rangeBar'],
      rangeBar: (['7d','30d','90d','custom'] as const).map((r) => `r-${r}`),

      kpis: kpis.map((k) => `kpi-${k.id}`),

      chartsGrid: ['trafficSec', 'sourceSec'],
      trafficSec: ['trafficChart'],
      sourceSec: ['sourceList'],

      regionSec: ['regionChart'],
    },
  }
  return <Renderer page={definePage(data)} />
}

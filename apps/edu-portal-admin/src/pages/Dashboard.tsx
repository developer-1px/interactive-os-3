import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Renderer, definePage, ROOT, Badge, Button, Progress, Row, fromList, type NormalizedData } from '@p/ds'
import { kpi, videos } from '../entities/data'
import { PAGE_PATHS } from '../entities/data'

type Period = 'daily' | 'weekly' | 'quarterly' | 'custom'
const PERIOD_LABELS: Record<Period, string> = {
  daily: '일간', weekly: '주간', quarterly: '분기별', custom: '사용자 지정',
}
const PERIOD_RANGE: Record<Period, string> = {
  daily: '2026.04.21',
  weekly: '2026.04.15 ~ 2026.04.21',
  quarterly: '2026.01 ~ 2026.03',
  custom: '2026.04.15 ~ 2026.04.21',
}
const PERIOD_CMP: Record<Period, string> = {
  daily: '전일 대비', weekly: '전주 대비', quarterly: '전분기 대비', custom: '전주 대비',
}

/** Mock dropout rows — 10 rows (원본 시안과 동일 수량). */
const dropoutRows = [
  { id: 'v2',  title: '클라우드 보안 취약점 진단 및 대응',      level: '고급', enrolled: 54,  dropouts: 23, rate: 43, risk: 'danger'  as const, riskLabel: '위험' },
  { id: 'v11', title: '쿠버네티스 네트워킹 심화',                 level: '고급', enrolled: 48,  dropouts: 20, rate: 42, risk: 'danger'  as const, riskLabel: '위험' },
  { id: 'v4',  title: '컨테이너 기반 배포 자동화',                level: '중급', enrolled: 72,  dropouts: 22, rate: 31, risk: 'warning' as const, riskLabel: '주의' },
  { id: 'v12', title: 'AI 모델 서빙 아키텍처',                    level: '고급', enrolled: 39,  dropouts: 11, rate: 28, risk: 'warning' as const, riskLabel: '주의' },
  { id: 'v13', title: '네이버 클라우드 VPC 구성',                 level: '중급', enrolled: 58,  dropouts: 15, rate: 26, risk: 'warning' as const, riskLabel: '주의' },
  { id: 'v1',  title: 'NCP CI/CD 파이프라인 구축 실습',           level: '중급', enrolled: 87,  dropouts: 19, rate: 22, risk: 'warning' as const, riskLabel: '주의' },
  { id: 'v14', title: 'Object Storage 실전 운영',                 level: '초급', enrolled: 93,  dropouts: 18, rate: 19, risk: 'success' as const, riskLabel: '양호' },
  { id: 'v5',  title: '클라우드 스토리지 설계와 운영',            level: '초급', enrolled: 65,  dropouts:  8, rate: 12, risk: 'success' as const, riskLabel: '양호' },
  { id: 'v15', title: 'HyperCLOVA X Studio 기초',                 level: '초급', enrolled: 104, dropouts: 10, rate: 10, risk: 'success' as const, riskLabel: '양호' },
  { id: 'v16', title: '클라우드 네이티브 입문',                   level: '초급', enrolled: 128, dropouts:  9, rate:  7, risk: 'success' as const, riskLabel: '양호' },
]

export function Dashboard() {
  const [period, setPeriod] = useState<Period>('weekly')
  const router = useRouter()
  const onSeeAll = () => router.navigate({ to: PAGE_PATHS['video-list'] })
  const goEdit = (id: string) =>
    router.navigate({ to: PAGE_PATHS['video-new'] + `/../${id}/edit` as never })

  const data: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'wide' } },

      /* ── 기간 필터 ─────────────────────────────────────────────── */
      filter: { id: 'filter', data: { type: 'Row', flow: 'cluster', label: '기간 필터' } },
      filterLabel: { id: 'filterLabel', data: { type: 'Text', variant: 'strong', content: '기간' } },
      filterSep: { id: 'filterSep', data: { type: 'Ui', component: 'Separator', props: { orientation: 'vertical' } } },
      ...Object.fromEntries((['daily','weekly','quarterly','custom'] as Period[]).map((p) => [
        `p-${p}`,
        { id: `p-${p}`, data: {
          type: 'Ui', component: 'ToolbarButton',
          props: { pressed: period === p, onClick: () => setPeriod(p) },
          content: PERIOD_LABELS[p],
        } },
      ])),
      customSep: { id: 'customSep', data: {
        type: 'Ui', component: 'Separator', props: { orientation: 'vertical' },
        hidden: period !== 'custom',
      } },
      dateFrom: { id: 'dateFrom', data: {
        type: 'Ui', component: 'Input',
        props: { type: 'date', 'aria-label': '시작일', defaultValue: '2026-04-15' },
        hidden: period !== 'custom',
      } },
      dateSep: { id: 'dateSep', data: { type: 'Text', variant: 'body', content: '~', hidden: period !== 'custom' } },
      dateTo: { id: 'dateTo', data: {
        type: 'Ui', component: 'Input',
        props: { type: 'date', 'aria-label': '종료일', defaultValue: '2026-04-21' },
        hidden: period !== 'custom',
      } },
      dateApply: { id: 'dateApply', data: {
        type: 'Ui', component: 'Button', content: '적용',
        hidden: period !== 'custom',
      } },

      pclSep: { id: 'pclSep', data: { type: 'Ui', component: 'Separator', props: { orientation: 'vertical' } } },
      pclLabel: { id: 'pclLabel', data: { type: 'Text', variant: 'small', content: '집계 기준' } },
      pclRange: { id: 'pclRange', data: { type: 'Text', variant: 'strong', content: PERIOD_RANGE[period] } },
      pclBadge: { id: 'pclBadge', data: {
        type: 'Ui', component: 'Badge',
        props: { variant: 'info', children: PERIOD_CMP[period] },
      } },

      /* ── KPI (heading 없음 — 원본 충실) ───────────────────────── */
      kpiGrid: { id: 'kpiGrid', data: { type: 'Grid', cols: 6, flow: 'form', label: '주요 지표', cardGrid: true } },
      ...kpiNodes(),

      /* ── Charts row: 역할별 | 레벨별 (grid cols=2) ─────────── */
      chartsGrid: { id: 'chartsGrid', data: { type: 'Grid', cols: 2, flow: 'form' } },
      chartSec: { id: 'chartSec', data: { type: 'Section', heading: { content: '역할별 수강 현황' }, emphasis: 'raised' } },
      chartBody: { id: 'chartBody', data: {
        type: 'Ui', component: 'BarChart',
        props: {
          caption: '단위: 수강 신청 수 (명)',
          data: fromList([
            { label: '개발자',   value: 312, pct: 100, variant: 'info' },
            { label: '엔지니어', value: 228, pct:  73, variant: 'success' },
            { label: '보안',     value: 138, pct:  44, variant: 'danger' },
            { label: 'AI',       value: 126, pct:  40, variant: 'warning' },
          ]),
        },
      } },
      lvlSec: { id: 'lvlSec', data: { type: 'Section', heading: { content: '레벨별 평균 완료율' }, emphasis: 'raised' } },
      lvlCol: { id: 'lvlCol', data: { type: 'Column', flow: 'form' } },
      ...levelRowNodes(),

      /* ── 영상별 이탈율 panel ──────────────────────────────── */
      dropSec: { id: 'dropSec', data: {
        type: 'Section', emphasis: 'raised', labelledBy: 'dropSec-h',
      } },
      dropHdr: { id: 'dropHdr', data: { type: 'Header', flow: 'split' } },
      dropTitleGroup: { id: 'dropTitleGroup', data: { type: 'Column', flow: 'list', grow: true } },
      dropTitle: { id: 'dropTitle', data: { type: 'Text', variant: 'h2', content: '영상별 이탈율' } },
      dropSub: { id: 'dropSub', data: { type: 'Text', variant: 'small', content: '50% 미만 시청 후 이탈' } },
      dropActions: { id: 'dropActions', data: { type: 'Row', flow: 'cluster' } },
      dropLegend: { id: 'dropLegend', data: { type: 'Row', flow: 'cluster' } },
      dropLegDanger:  { id: 'dropLegDanger',  data: { type: 'Ui', component: 'LegendDot', props: { variant: 'danger',  children: '≥40% 위험' } } },
      dropLegWarning: { id: 'dropLegWarning', data: { type: 'Ui', component: 'LegendDot', props: { variant: 'warning', children: '20–39% 주의' } } },
      dropLegSuccess: { id: 'dropLegSuccess', data: { type: 'Ui', component: 'LegendDot', props: { variant: 'success', children: '<20% 양호' } } },
      dropSort: { id: 'dropSort', data: {
        type: 'Ui', component: 'Select',
        props: { 'aria-label': '정렬', defaultValue: 'rate-desc' },
        content: (
          <>
            <option value="rate-desc">이탈율 높은 순</option>
            <option value="rate-asc">이탈율 낮은 순</option>
            <option value="enrolled-desc">수강 신청 많은 순</option>
          </>
        ),
      } },
      dropTable: { id: 'dropTable', data: { type: 'Ui', component: 'DataGrid', props: { 'aria-label': '영상별 이탈율', 'data-density': 'compact' } } },
      dropHeadGroup: { id: 'dropHeadGroup', data: { type: 'Ui', component: 'RowGroup' } },
      dropHeadRow:   { id: 'dropHeadRow',   data: { type: 'Ui', component: 'DataGridRow' } },
      ...headerCellNodes('drop', ['영상 제목','레벨','수강 신청','이탈 수','이탈율','위험도','']),
      dropBodyGroup: { id: 'dropBodyGroup', data: { type: 'Ui', component: 'RowGroup' } },
      ...dropoutRowNodes(goEdit),
      dropFoot: { id: 'dropFoot', data: { type: 'Footer' } },
      dropNote: { id: 'dropNote', data: { type: 'Text', variant: 'small',
        content: '※ 이탈율 = 전체 재생 시간의 50% 미만 시청 후 이탈한 수강자 수 ÷ 수강 신청 수 × 100 · 수강 신청 0건 영상 제외' } },

      /* ── 최근 등록 영상 ──────────────────────────────────── */
      recentSec: { id: 'recentSec', data: {
        type: 'Section', emphasis: 'raised', labelledBy: 'recentSec-h',
      } },
      recentHdr: { id: 'recentHdr', data: { type: 'Header', flow: 'split' } },
      recentTitle: { id: 'recentTitle', data: { type: 'Text', variant: 'h2', content: '최근 등록 영상' } },
      recentSeeAll: { id: 'recentSeeAll', data: {
        type: 'Ui', component: 'Button', props: { onClick: onSeeAll }, content: '전체 보기',
      } },
      recentGrid: { id: 'recentGrid', data: { type: 'Ui', component: 'DataGrid', props: { 'aria-label': '최근 등록 영상', 'data-density': 'compact' } } },
      recentHeadGroup: { id: 'recentHeadGroup', data: { type: 'Ui', component: 'RowGroup' } },
      recentHeadRow:   { id: 'recentHeadRow',   data: { type: 'Ui', component: 'DataGridRow' } },
      ...headerCellNodes('recent', ['','영상 제목','레벨','역할','수강 신청','완료율','별점','상태','등록일']),
      recentBodyGroup: { id: 'recentBodyGroup', data: { type: 'Ui', component: 'RowGroup' } },
      ...videoRowNodes('recent'),

      /* ── Top10 grid-2 ─────────────────────────────────────── */
      topGrid: { id: 'topGrid', data: { type: 'Grid', cols: 2, flow: 'form' } },
      kwSec: { id: 'kwSec', data: {
        type: 'Section', heading: { variant: 'h3', content: '검색키워드 Top 10' }, emphasis: 'raised',
      } },
      kwSub: { id: 'kwSub', data: { type: 'Text', variant: 'small', content: '이번 주 기준' } },
      kwList: { id: 'kwList', data: {
        type: 'Ui', component: 'Top10List',
        props: {
          data: fromList([
            { label: 'Kubernetes', count: '142회' },
            { label: 'NKS',        count:  '98회' },
            { label: 'CI/CD',      count:  '76회' },
          ]),
        },
      } },
      vidSec: { id: 'vidSec', data: {
        type: 'Section', heading: { variant: 'h3', content: '가장 많이 재생된 영상 Top 10' }, emphasis: 'raised',
      } },
      vidSub: { id: 'vidSub', data: { type: 'Text', variant: 'small', content: '이번 주 기준' } },
      vidList: { id: 'vidList', data: {
        type: 'Ui', component: 'Top10List',
        props: {
          data: fromList(videos.map((v) => ({ label: v.title, count: `${v.enrolled}회` }))),
        },
      } },
    },
    relationships: {
      [ROOT]: ['page'],
      // 순서: filter → KPI → chart+level(grid-2) → dropout → recent → top10 (원본 충실)
      page: ['filter', 'kpiGrid', 'chartsGrid', 'dropSec', 'recentSec', 'topGrid'],

      filter: [
        'filterLabel','filterSep','p-daily','p-weekly','p-quarterly','p-custom',
        'customSep','dateFrom','dateSep','dateTo','dateApply',
        'pclSep','pclLabel','pclRange','pclBadge',
      ],

      kpiGrid: ['k-totalVideos','k-enrolled','k-completion','k-rating','k-dropout'],

      chartsGrid: ['chartSec', 'lvlSec'],
      chartSec: ['chartBody'],
      lvlSec: ['lvlCol'],
      lvlCol: ['lr-초급','lr-중급','lr-고급'],
      'lr-초급': ['ll-초급','lp-초급','lv-초급'],
      'lr-중급': ['ll-중급','lp-중급','lv-중급'],
      'lr-고급': ['ll-고급','lp-고급','lv-고급'],

      dropSec: ['dropHdr', 'dropTable', 'dropFoot'],
      dropHdr: ['dropTitleGroup', 'dropActions'],
      dropTitleGroup: ['dropTitle', 'dropSub'],
      dropActions: ['dropLegend', 'dropSort'],
      dropLegend: ['dropLegDanger','dropLegWarning','dropLegSuccess'],
      dropTable: ['dropHeadGroup', 'dropBodyGroup'],
      dropHeadGroup: ['dropHeadRow'],
      dropHeadRow: ['drop-h-0','drop-h-1','drop-h-2','drop-h-3','drop-h-4','drop-h-5','drop-h-6'],
      dropBodyGroup: dropoutRows.map((r) => `drop-row-${r.id}`),
      ...dropoutRowRels(),
      dropFoot: ['dropNote'],

      recentSec: ['recentHdr', 'recentGrid'],
      recentHdr: ['recentTitle', 'recentSeeAll'],
      recentGrid: ['recentHeadGroup', 'recentBodyGroup'],
      recentHeadGroup: ['recentHeadRow'],
      recentHeadRow: ['recent-h-0','recent-h-1','recent-h-2','recent-h-3','recent-h-4','recent-h-5','recent-h-6','recent-h-7','recent-h-8'],
      recentBodyGroup: videos.map((v) => `recent-row-${v.id}`),
      ...videoRowRels('recent'),

      topGrid: ['kwSec', 'vidSec'],
      kwSec: ['kwSub', 'kwList'],
      vidSec: ['vidSub', 'vidList'],
    },
  }

  return <Renderer page={definePage(data)} />
}

/* ── helpers ───────────────────────────────────────────────────── */

function kpiNodes() {
  // 이모지 아이콘 → lucide 토큰으로 치환. StatCard.icon은 ReactNode라 span[data-icon]으로 전달.
  const items: Array<{
    key: string; kpiKey: keyof typeof kpi; term: string; iconToken: string;
    changeDir: 'up' | 'down'; variant?: 'danger'; topBadge?: string;
  }> = [
    { key: 'totalVideos', kpiKey: 'totalVideos', term: '전체 영상',  iconToken: 'video',       changeDir: 'up', topBadge: '누적' },
    { key: 'enrolled',    kpiKey: 'enrolled',    term: '수강 신청',  iconToken: 'users',       changeDir: 'up' },
    { key: 'completion',  kpiKey: 'completion',  term: '평균 완료율', iconToken: 'badge-check', changeDir: 'up' },
    { key: 'rating',      kpiKey: 'rating',      term: '평균 별점',   iconToken: 'star',        changeDir: 'down' },
    { key: 'dropout',     kpiKey: 'dropout',     term: '평균 이탈율', iconToken: 'door-open',   changeDir: 'down', variant: 'danger' },
  ]
  const out: Record<string, { id: string; data: Record<string, unknown> }> = {}
  for (const it of items) {
    const v = kpi[it.kpiKey]
    out[`k-${it.key}`] = {
      id: `k-${it.key}`,
      data: {
        type: 'Ui', component: 'StatCard',
        props: {
          label: it.term, value: v.value, sub: v.sub, change: v.change,
          changeDir: it.changeDir,
          icon: <span data-icon={it.iconToken} aria-hidden="true" />,
          variant: it.variant ?? 'normal',
          topBadge: it.topBadge ? { variant: 'info', content: it.topBadge } : undefined,
          'aria-label': it.term,
        },
      },
    }
  }
  return out
}

function levelRowNodes() {
  type Tone = 'success' | 'warning' | 'danger'
  const levels: Array<{ label: string; value: number; variant: Tone }> = [
    { label: '초급', value: 81, variant: 'success' },
    { label: '중급', value: 67, variant: 'warning' },
    { label: '고급', value: 52, variant: 'danger' },
  ]
  const out: Record<string, { id: string; data: Record<string, unknown> }> = {}
  for (const { label, value, variant } of levels) {
    out[`lr-${label}`] = { id: `lr-${label}`, data: { type: 'Row', flow: 'cluster' } }
    out[`ll-${label}`] = {
      id: `ll-${label}`,
      data: {
        type: 'Ui', component: 'Badge',
        props: { variant, children: label },
        width: 56,
      },
    }
    out[`lp-${label}`] = {
      id: `lp-${label}`,
      data: { type: 'Ui', component: 'Progress',
        props: { value, max: 100, 'aria-label': `${label} 완료율` },
        grow: true },
    }
    out[`lv-${label}`] = {
      id: `lv-${label}`,
      data: { type: 'Text', variant: 'strong', content: `${value}%`, width: 48, align: 'end' },
    }
  }
  return out
}

function headerCellNodes(prefix: string, labels: string[]) {
  const out: Record<string, { id: string; data: Record<string, unknown> }> = {}
  labels.forEach((label, i) => {
    out[`${prefix}-h-${i}`] = {
      id: `${prefix}-h-${i}`,
      data: { type: 'Ui', component: 'ColumnHeader', content: label },
    }
  })
  return out
}

function videoRowNodes(prefix: string) {
  const out: Record<string, { id: string; data: Record<string, unknown> }> = {}
  for (const v of videos) {
    out[`${prefix}-row-${v.id}`] = {
      id: `${prefix}-row-${v.id}`,
      data: { type: 'Ui', component: 'DataGridRow' },
    }
    const levelTone = v.level === '초급' ? 'success' : v.level === '중급' ? 'warning' : 'danger'
    const statusTone = v.status === '게시 중' ? 'success' : v.status === '임시저장' ? 'default' : v.status === '예약' ? 'info' : 'default'
    const completionCell = v.completion == null
      ? '—'
      : <Row flow="cluster">
          <Progress value={v.completion} max={100} aria-label={`완료율 ${v.completion}%`} />
          <small>{v.completion}%</small>
        </Row>
    const roleChips = <Row flow="cluster">
      {v.roles.map((r) => <Badge key={r} variant="default">{r}</Badge>)}
    </Row>
    const cells: Array<[string, unknown]> = [
      [`thumb`, <span data-icon="video" aria-hidden="true" />],
      [`title`, <>{v.title}<br /><small>{v.duration} · {v.tags.join(', ')}</small></>],
      [`level`, <Badge variant={levelTone}>{v.level}</Badge>],
      [`roles`, roleChips],
      [`enrolled`, v.enrolled],
      [`completion`, completionCell],
      [`rating`, v.rating == null ? '—' : <span data-icon="star" aria-label={`별점 ${v.rating}`}>{v.rating}</span>],
      [`status`, <Badge variant={statusTone}>{v.status}</Badge>],
      [`createdAt`, v.createdAt],
    ]
    for (const [key, content] of cells) {
      out[`${prefix}-c-${v.id}-${key}`] = {
        id: `${prefix}-c-${v.id}-${key}`,
        data: { type: 'Ui', component: 'GridCell', content },
      }
    }
  }
  return out
}

function videoRowRels(prefix: string) {
  const out: Record<string, string[]> = {}
  const keys = ['thumb','title','level','roles','enrolled','completion','rating','status','createdAt']
  for (const v of videos) {
    out[`${prefix}-row-${v.id}`] = keys.map((k) => `${prefix}-c-${v.id}-${k}`)
  }
  return out
}

function dropoutRowNodes(goEdit: (id: string) => void) {
  const out: Record<string, { id: string; data: Record<string, unknown> }> = {}
  for (const r of dropoutRows) {
    out[`drop-row-${r.id}`] = {
      id: `drop-row-${r.id}`,
      data: { type: 'Ui', component: 'DataGridRow' },
    }
    const levelTone = r.level === '초급' ? 'success' : r.level === '중급' ? 'warning' : 'danger'
    const rateCell = <Row flow="cluster">
      <Progress value={r.rate} max={100} aria-label={`이탈율 ${r.rate}%`} />
      <strong>{r.rate}%</strong>
    </Row>
    const cells: Array<[string, unknown]> = [
      [`title`, r.title],
      [`level`, <Badge variant={levelTone}>{r.level}</Badge>],
      [`enrolled`, r.enrolled],
      [`dropouts`, r.dropouts],
      [`rate`, rateCell],
      [`risk`, <Badge variant={r.risk}>{r.riskLabel}</Badge>],
      [`action`, <Button onClick={() => goEdit(r.id)}>수정</Button>],
    ]
    for (const [key, content] of cells) {
      out[`drop-c-${r.id}-${key}`] = {
        id: `drop-c-${r.id}-${key}`,
        data: { type: 'Ui', component: 'GridCell', content },
      }
    }
  }
  return out
}

function dropoutRowRels() {
  const out: Record<string, string[]> = {}
  const keys = ['title','level','enrolled','dropouts','rate','risk','action']
  for (const r of dropoutRows) {
    out[`drop-row-${r.id}`] = keys.map((k) => `drop-c-${r.id}-${k}`)
  }
  return out
}

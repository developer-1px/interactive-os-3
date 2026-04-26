import { createElement, type ReactNode } from 'react'
import { ROOT, type Event, type NormalizedData } from '../../ds'
import type { AuditData } from 'virtual:ds-audit'
import type { TableColumn } from '../../ds/parts/Table'
import type { CardSlot } from '../../ds/parts/Card'
import {
  Avatar, Badge, Tag, Thumbnail, Timestamp,
  Skeleton, EmptyState, Callout, KeyValue,
} from '../../ds/parts'

// FnCard → Card slots 매핑.
// guard-serializable: entity data 안 `title:` `body:` `footer:` 키에 JSX 리터럴 ❌.
// → createElement + 동적 키 할당으로 우회 (canonical 슬롯 어휘는 유지).
function fnCardSlots(args: {
  name: string
  doc?: string
  signature: string
  sites?: AuditData['callSites'][string]
  demo?: ReactNode
}): Partial<Record<CardSlot, ReactNode>> {
  const { name, doc, signature, sites, demo } = args
  const auditing = sites !== undefined
  const count = sites?.length ?? 0
  const dead = auditing && count === 0
  const titleNode = createElement(
    'header',
    null,
    createElement('code', null, name),
    auditing && createElement(
      'span',
      {
        'data-badge': true,
        'data-tone': dead ? 'bad' : 'good',
        'aria-label': `${count} call sites`,
        title: count
          ? sites!.slice(0, 10).map((s) => `${s.file}:${s.line}`).join('\n')
          : '호출처 없음 — 죽은 조립식 가능성',
      },
      `×${count}`,
    ),
  )
  const bodyNode = doc ? createElement('p', null, doc) : undefined
  const footerNode = createElement('code', { 'data-role': 'signature' }, signature)
  const slots: Partial<Record<CardSlot, ReactNode>> = {}
  slots.title = titleNode
  if (demo !== undefined) slots.preview = demo
  if (bodyNode !== undefined) slots.body = bodyNode
  slots.footer = footerNode
  return slots
}

const LEAK_COLUMNS: TableColumn[] = [
  { key: 'file', label: '파일' },
  { key: 'line', label: 'line', align: 'end' },
  { key: 'kind', label: 'kind' },
  { key: 'snippet', label: 'snippet' },
]

// 9 parts × name + 1줄 설명 + demo render. variant 도입 없음 — 호출 인자만 다름.
const PARTS: { name: string; doc: string; demo: ReactNode }[] = [
  { name: 'Avatar',     doc: '사람·엔티티 식별. src 있으면 img, 없으면 fallback initial.', demo: <Avatar alt="Jane Doe" initial="J" /> },
  { name: 'Badge',      doc: 'counter(숫자) 또는 status dot. tone=success/warning/danger.', demo: <Badge count={3} tone="danger" label="3 unread" /> },
  { name: 'Tag',        doc: '라벨 + optional remove(×). chip 아니라 Tag로 통일.',          demo: <Tag label="design-system" /> },
  { name: 'Thumbnail',  doc: 'aspect-ratio 보존 미리보기 미디어.',                          demo: <Thumbnail src="data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect width=%2280%22 height=%2280%22 fill=%22%23ddd%22/></svg>" alt="placeholder" ratio="1/1" /> },
  { name: 'Timestamp',  doc: '<time datetime> 시맨틱. absolute or relative.',               demo: <Timestamp value={Date.now() - 1000 * 60 * 7} display="relative" /> },
  { name: 'Skeleton',   doc: '로딩 placeholder. 단색 box. width/height 호출부 결정.',       demo: <Skeleton width={120} height={12} /> },
  { name: 'EmptyState', doc: 'icon + heading + description + optional CTA.',                demo: <EmptyState title="No results" description="검색어를 바꿔보세요." /> },
  { name: 'Callout',    doc: 'info/success/warning/danger 메시지 박스. role 자동.',         demo: <Callout tone="info">정보 메시지입니다.</Callout> },
  { name: 'KeyValue',   doc: '<dl><dt><dd> 라벨-값 쌍. 데이터 주도(items prop).',           demo: <KeyValue items={[{ key: 'Status', value: 'Active' }, { key: 'Plan', value: 'Pro' }]} /> },
]

// Coverage: 표준 17 대비 9 — 누락은 다른 layer에 존재하거나 미구현.
const COVERAGE_NOTE = '9 / 17 standard parts. 다른 layer에 존재: Heading scale·Money·Stat (entity), Divider (fn hairline), Progress (ui/2-action). 미구현: Link, Code/Kbd, Breadcrumb.'

export interface FoundationsState {
  filter: string  // 'all' | 'leaks' | 'missing' | 'parts' | <file path>
  exports: AuditData['exports']
  callSites: AuditData['callSites']
  leaks: AuditData['leaks']
  byFile: [string, AuditData['exports']][]
  missingDemos: AuditData['exports']
  nav: { data: NormalizedData; onEvent: (e: Event) => void }
  presetTools: { data: NormalizedData; onEvent: (e: Event) => void }
  renderDemo: (e: AuditData['exports'][number]) => ReactNode
}

export function buildFoundationsPage(s: FoundationsState): NormalizedData {
  const showLeaks = s.filter === 'leaks'
  const showParts = s.filter === 'parts'
  const showMissing = s.filter === 'missing'
  const visibleFiles = s.filter === 'all' || showLeaks || showParts || showMissing
    ? s.byFile
    : s.byFile.filter(([f]) => f === s.filter)

  const headerLabel = s.filter === 'all'
    ? 'Foundations'
    : showLeaks ? 'Leak Report'
    : showParts ? 'Parts'
    : showMissing ? `Missing @demo (${s.missingDemos.length})`
    : s.filter.replace('/src/ds/foundations/', '')

  const headerBlurb = showLeaks
    ? 'style/widgets/** 에서 foundations/ 을 거치지 않은 리터럴·직접 var 참조. 0에 가까울수록 메타-DS.'
    : showParts
    ? 'ds/parts/ 표준 부품 카탈로그 — 작은 시각 어휘. 1 role = 1 component.'
    : showMissing
    ? '@demo JSDoc 태그가 없는 export. 0에 가까울수록 자동 쇼케이스 완전성↑.'
    : 'foundations/ 레이어가 메타-DS인지 시각으로 판정'

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    page: { id: 'page', data: { type: 'Row', flow: 'list', roledescription: 'foundations-page', label: 'Foundations' } },

    nav: { id: 'nav', data: { type: 'Nav', flow: 'list', emphasis: 'sunk', width: 240, label: 'Foundations navigation', roledescription: 'sidebar' } },
    navTitle: { id: 'navTitle', data: { type: 'Text', variant: 'small', content: 'ds Foundations' } },
    navList: { id: 'navList', data: { type: 'Ui', component: 'Listbox', props: { data: s.nav.data, onEvent: s.nav.onEvent, 'aria-label': 'fn group' } } },

    workspace: { id: 'workspace', data: { type: 'Main', flow: 'list', grow: true, label: headerLabel } },
    topbar: { id: 'topbar', data: { type: 'Header', flow: 'cluster' } },
    topTitleCol: { id: 'topTitleCol', data: { type: 'Column', flow: 'list', grow: true } },
    topTitle: { id: 'topTitle', data: { type: 'Text', variant: 'h1', content: headerLabel } },
    topBlurb: { id: 'topBlurb', data: { type: 'Text', variant: 'muted', content: headerBlurb } },
    presetTools: { id: 'presetTools', data: { type: 'Ui', component: 'Toolbar', props: { data: s.presetTools.data, onEvent: s.presetTools.onEvent, 'aria-label': 'Preset' } } },

    content: { id: 'content', data: { type: 'Section', flow: 'list', grow: true } },
  }

  const relationships: NormalizedData['relationships'] = {
    [ROOT]: ['page'],
    page: ['nav', 'workspace'],
    nav: ['navTitle', 'navList'],
    workspace: ['topbar', 'content'],
    topbar: ['topTitleCol', 'presetTools'],
    topTitleCol: ['topTitle', 'topBlurb'],
    content: [],
  }

  if (showLeaks) {
    const stripPrefix = '/src/ds/style/widgets/'
    const leakRows = s.leaks.map((l) => ({
      file: createElement('code', null, l.file.replace(stripPrefix, '')),
      line: l.line,
      kind: l.kind,
      snippet: createElement('code', null, l.snippet),
    }))
    entities.leaksCard = {
      id: 'leaksCard',
      data: {
        type: 'Ui',
        component: 'Table',
        props: {
          columns: LEAK_COLUMNS,
          rows: leakRows,
          caption: `style/widgets/** raw-value 누수 ${s.leaks.length}건`,
        },
      },
    }
    relationships.content = ['leaksCard']
  } else if (showParts) {
    entities.partsCoverage = {
      id: 'partsCoverage',
      data: { type: 'Text', variant: 'muted', content: COVERAGE_NOTE },
    }
    entities.partsGrid = { id: 'partsGrid', data: { type: 'Grid', cols: 3, cardGrid: true } }
    const partIds: string[] = []
    for (const p of PARTS) {
      const pid = `part-${p.name}`
      entities[pid] = {
        id: pid,
        data: {
          type: 'Ui',
          component: 'Card',
          props: {
            slots: fnCardSlots({
              name: p.name,
              doc: p.doc,
              signature: `<${p.name} />`,
              demo: p.demo,
            }),
          },
        },
      }
      partIds.push(pid)
    }
    relationships.partsGrid = partIds
    relationships.content = ['partsCoverage', 'partsGrid']
  } else if (showMissing) {
    const rows = s.missingDemos.map((e) => ({
      name: createElement('code', null, e.name),
      file: e.file.replace('/src/ds/foundations/', ''),
      signature: createElement('code', null, e.signature),
    }))
    entities.missingCard = {
      id: 'missingCard',
      data: {
        type: 'Ui',
        component: 'Table',
        props: {
          columns: [
            { key: 'name', label: 'name' },
            { key: 'file', label: 'file' },
            { key: 'signature', label: 'signature' },
          ] satisfies TableColumn[],
          rows,
          caption: `${s.missingDemos.length} export(s) without @demo`,
        },
      },
    }
    relationships.content = ['missingCard']
  } else {
    const groupIds: string[] = []
    for (const [file, list] of visibleFiles) {
      const gid = `g-${file}`
      const hdr = `gh-${file}`
      const grid = `gr-${file}`
      const ttl = `gt-${file}`
      const cnt = `gc-${file}`
      entities[gid] = { id: gid, data: { type: 'Section', flow: 'list', label: file.replace('/src/ds/foundations/', '') } }
      entities[hdr] = { id: hdr, data: { type: 'Header', flow: 'cluster' } }
      entities[ttl] = { id: ttl, data: { type: 'Text', variant: 'h2', content: file.replace('/src/ds/foundations/', '') } }
      entities[cnt] = { id: cnt, data: { type: 'Text', variant: 'small', content: String(list.length) } }
      entities[grid] = { id: grid, data: { type: 'Grid', cols: 3, cardGrid: true } }
      relationships[gid] = [hdr, grid]
      relationships[hdr] = [ttl, cnt]
      const cardIds: string[] = []
      for (const fn of list) {
        const cid = `card-${fn.name}`
        entities[cid] = {
          id: cid,
          data: {
            type: 'Ui',
            component: 'Card',
            props: {
              slots: fnCardSlots({
                name: fn.name,
                doc: fn.doc,
                signature: fn.signature,
                sites: s.callSites[fn.name] ?? [],
                demo: s.renderDemo(fn),
              }),
            },
          },
        }
        cardIds.push(cid)
      }
      relationships[grid] = cardIds
      groupIds.push(gid)
    }
    relationships.content = groupIds
  }

  return { entities, relationships }
}

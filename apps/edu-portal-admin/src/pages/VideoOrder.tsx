import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
import {
  videos, roleCategories, certCategories,
  LEVEL_TONE, STATUS_TONE, type VideoRow,
} from '../entities/data'

type Mode = 'role' | 'cert'

const levelRank: Record<VideoRow['level'], number> = { 초급: 1, 중급: 2, 고급: 3 }
const NEW_THRESHOLD_MS = 7 * 86_400_000

const visibleRoles = roleCategories.filter((c) => c.visible)
const visibleCerts = certCategories.filter((c) => c.visible)
const allCategories = [...roleCategories, ...certCategories]
type SegmentOption = { id: string; label: string; selected: boolean }
type ActivateLike = { type: string; id?: string }

function parseDate(s: string): number {
  const [y, m, d] = s.split('.').map(Number)
  return y ? new Date(y, (m ?? 1) - 1, d ?? 1).getTime() : 0
}
function isNew(v: VideoRow, now: number): boolean {
  return now - parseDate(v.createdAt) < NEW_THRESHOLD_MS
}
function durationMin(t: string): number {
  const [hh, mm, ss] = t.split(':').map(Number)
  return (hh || 0) * 60 + (mm || 0) + (ss || 0) / 60
}
function totalDurationLabel(items: VideoRow[]): string {
  const m = Math.round(items.reduce((a, v) => a + durationMin(v.duration), 0))
  return m >= 60 ? `총 ${Math.floor(m / 60)}시간 ${m % 60}분` : `총 ${m}분`
}
function levelDistLabel(items: VideoRow[]): string {
  const c = { 초급: 0, 중급: 0, 고급: 0 }
  for (const v of items) c[v.level]++
  return `초 ${c.초급} · 중 ${c.중급} · 고 ${c.고급}`
}
function levelOrderBroken(items: VideoRow[]): boolean {
  for (let i = 1; i < items.length; i++) {
    if (levelRank[items[i].level] < levelRank[items[i - 1].level]) return true
  }
  return false
}
function move(list: string[], fromId: string, toId: string): string[] {
  const from = list.indexOf(fromId), to = list.indexOf(toId)
  if (from < 0 || to < 0 || from === to) return list
  const next = list.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function VideoOrder() {
  const [mode, setMode] = useState<Mode>('role')
  const cats = mode === 'role' ? visibleRoles : visibleCerts
  const [subId, setSubId] = useState(cats[0]?.id ?? '')
  const current = cats.find((c) => c.id === subId) ?? cats[0]

  const [orders, setOrders] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(allCategories.map((c) => [c.id, c.videoIds])),
  )
  const [baseline, setBaseline] = useState(orders)

  // eslint-disable-next-line react-hooks/purity -- "isNew" 라벨링용 시각 — frame 단위 정확도 충분
  const now = Date.now()
  const order = current ? orders[current.id] ?? [] : []
  const items = order.map((id) => videos.find((v) => v.id === id)).filter((v): v is VideoRow => Boolean(v))
  const dirty = current
    ? (orders[current.id] ?? []).join('|') !== (baseline[current.id] ?? []).join('|')
    : false
  const broken = levelOrderBroken(items)

  const onReorder = (fromId: string, toId: string) => {
    if (!current) return
    setOrders((prev) => ({ ...prev, [current.id]: move(prev[current.id] ?? [], fromId, toId) }))
  }
  const save = () => {
    if (!current || !dirty) return
    setBaseline((prev) => ({ ...prev, [current.id]: orders[current.id] ?? [] }))
  }
  const switchMode = (next: Mode) => {
    setMode(next)
    const first = (next === 'role' ? visibleRoles : visibleCerts)[0]
    if (first) setSubId(first.id)
  }

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    page: { id: 'page', data: { type: 'Column', flow: 'form' } },

    modeTabs: { id: 'modeTabs', data: {
      type: 'Ui', component: 'SegmentedControl',
      props: {
        'aria-label': '순서 기준',
        data: segmentData([
          { id: 'role', label: '역할별', selected: mode === 'role' },
          { id: 'cert', label: '코스별', selected: mode === 'cert' },
        ]),
        onEvent: (e: ActivateLike) => {
          if (e.type === 'activate' && (e.id === 'role' || e.id === 'cert')) switchMode(e.id)
        },
      },
    } },

    panel: { id: 'panel', data: { type: 'Ui', component: 'TabPanel', props: { 'aria-label': mode === 'role' ? '역할별' : '코스별' } } },
    subTabs: { id: 'subTabs', data: {
      type: 'Ui', component: 'SegmentedControl',
      props: {
        'aria-label': mode === 'role' ? '역할 선택' : '코스 선택',
        data: segmentData(categorySegments(cats, orders, subId)),
        onEvent: (e: ActivateLike) => {
          if (e.type === 'activate' && e.id) setSubId(e.id)
        },
      },
    } },

    body: { id: 'body', data: { type: 'Column', flow: 'list', maxWidth: 820 } },
    catHdr: { id: 'catHdr', data: { type: 'Header', flow: 'split' } },
    catName: { id: 'catName', data: { type: 'Text', variant: 'h3', content: current?.name ?? '—' } },
    catTotal: { id: 'catTotal', data: {
      type: 'Text', variant: 'small',
      content: items.length ? `${totalDurationLabel(items)} · ${levelDistLabel(items)}` : '영상 없음',
    } },

    ...(broken ? {
      warn: { id: 'warn', data: { type: 'Text', variant: 'small', content: '난이도가 거꾸로 정렬된 구간이 있어요. 드래그로 흐름을 맞춰주세요.' } },
    } : {}),

    list: { id: 'list', data: {
      type: 'Ui', component: 'OrderableList',
      props: {
        data: buildListData(items, now),
        onReorder, numbered: true,
        'aria-label': `${current?.name ?? ''} 영상 순서`,
      },
    } },

    footer: { id: 'footer', data: { type: 'Footer', flow: 'split' } },
    footNote: { id: 'footNote', data: {
      type: 'Text', variant: 'small',
      content: dirty ? '저장하지 않은 변경 사항이 있어요.' : '드래그하거나 핸들에서 ↑↓ 키로 순서를 바꿉니다.',
    } },
    saveBtn: { id: 'saveBtn', data: {
      type: 'Ui', component: 'Button',
      props: { onClick: save, disabled: !dirty, variant: dirty ? 'primary' : undefined },
      content: '저장',
    } },
  }

  const relationships: NormalizedData['relationships'] = {
    [ROOT]: ['page'],
    page: ['modeTabs', 'panel'],
    panel: ['subTabs', 'body'],
    body: ['catHdr', ...(broken ? ['warn'] : []), 'list', 'footer'],
    catHdr: ['catName', 'catTotal'],
    footer: ['footNote', 'saveBtn'],
  }

  return <Renderer page={definePage({ entities, relationships })} />
}

function segmentData(options: SegmentOption[]): NormalizedData {
  return {
    entities: Object.fromEntries([
      [ROOT, { id: ROOT, data: {} }],
      ...options.map((option) => [
        option.id,
        { id: option.id, data: { label: option.label, selected: option.selected } },
      ]),
    ]),
    relationships: { [ROOT]: options.map((option) => option.id) },
  }
}

function categorySegments(
  categories: typeof roleCategories | typeof certCategories,
  orders: Record<string, string[]>,
  subId: string,
): SegmentOption[] {
  return categories.map((c) => ({
    id: c.id,
    label: `${c.name} (${orders[c.id]?.length ?? c.videoIds.length})`,
    selected: c.id === subId,
  }))
}

function buildListData(items: VideoRow[], now: number): NormalizedData {
  const entities: NormalizedData['entities'] = { [ROOT]: { id: ROOT, data: {} } }
  for (const v of items) {
    entities[v.id] = {
      id: v.id,
      data: {
        primary: v.title,
        secondary: `${v.duration} · ${v.createdAt}`,
        meta: (
          <>
            {v.status !== '게시 중' && <mark data-variant={STATUS_TONE[v.status]}>{v.status}</mark>}
            <mark data-variant={LEVEL_TONE[v.level]}>{v.level}</mark>
          </>
        ),
        badge: isNew(v, now) ? <mark data-variant="info">NEW</mark> : null,
      },
    }
  }
  return { entities, relationships: { [ROOT]: items.map((v) => v.id) } }
}

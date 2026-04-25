/** Catalog — ds ui zone-first 감사 대시보드. master-slave sidebar (FlatLayout). */
import { useMemo, useState, type ReactNode } from 'react'
import { contracts, type Contract, type Kind } from 'virtual:ds-contracts'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  ROOT, type Event, type NormalizedData,
} from '../../ds'
import { demos } from './demos'
import { buildCatalogPage } from './build'

const kindLabel: Record<Kind, string> = {
  collection: 'collection',
  composite:  'composite',
  control:    'control',
  overlay:    'overlay',
  entity:     'entity',
  layout:     'layout',
  drift:      'drift',
}

const kindBlurb: Record<Kind, string> = {
  collection: 'data-driven roving — CollectionProps={data, onEvent} + useRoving. item 은 closed schema 의 leaf variant.',
  composite:  'composition roving — children: ReactNode + useRovingDOM. 그룹 단위 Tab stop, 자식은 자유 JSX.',
  control:    'atomic native — 단일 tabbable element wrap. activate 는 네이티브 button/input 이 담당.',
  overlay:    'surface — native dialog/popover/details. Escape · backdrop · focus trap 은 플랫폼이 위임.',
  entity:     'domain content card — 2+ 도메인 힌트 속성. roving 무관, 정보 표현 단위.',
  layout:     'primitive · decoration — Row/Column/Grid 와 정적 시각화. roving 무관.',
  drift:      'zone 폴더 외부 — collection/composite/control/overlay/entity/layout 중 하나로 이동',
}

const kindOrder: Kind[] = ['collection', 'composite', 'control', 'overlay', 'entity', 'layout', 'drift']

type Filter = Kind | 'all'

const navBase = (filter: Filter, grouped: Record<Kind, Contract[]>, total: number): NormalizedData => {
  const items: { id: Filter; label: string; badge: number }[] = [
    { id: 'all', label: 'All', badge: total },
    ...kindOrder.map((k) => ({ id: k, label: kindLabel[k], badge: grouped[k].length })),
  ]
  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: filter } },
  }
  for (const it of items) {
    entities[it.id] = { id: it.id, data: { label: it.label, badge: it.badge, selected: it.id === filter } }
  }
  return { entities, relationships: { [ROOT]: items.map((i) => i.id) } }
}

export function Catalog() {
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const m: Record<Kind, Contract[]> = {
      collection: [], composite: [], control: [], overlay: [], entity: [], layout: [], drift: [],
    }
    for (const c of contracts) m[c.kind].push(c)
    return m
  }, [])

  const totals = useMemo(() => {
    const total = contracts.length
    const canonical = grouped.collection.length
    const drift = grouped.drift.length
    const passAll = contracts.filter((c) => c.checks.every((k) => k.pass)).length
    return { total, canonical, drift, passAll }
  }, [grouped])

  const visible: Kind[] = filter === 'all' ? kindOrder : [filter as Kind]
  const visibleZones = visible.filter((k) => grouped[k].length > 0)
  const headerLabel = filter === 'all' ? 'Catalog' : kindLabel[filter as Kind]
  const headerBlurb = filter === 'all' ? 'ui 컴포넌트 zone-first 감사' : kindBlurb[filter as Kind]

  const navData0 = useMemo(() => navBase(filter, grouped, totals.total), [filter, grouped, totals.total])
  const [navData, navDispatch] = useControlState(navData0)
  const onNavEvent = (e: Event) =>
    navigateOnActivate(navData, e).forEach((ev) => {
      navDispatch(ev)
      if (ev.type === 'activate') setFilter(ev.id as Filter)
    })

  const renderDemo = (name: string): ReactNode => {
    const Render = demos[name]
    return Render ? <Render /> : undefined
  }

  const onCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const card = target.closest('[data-name]') as HTMLElement | null
    if (!card) return
    const n = card.getAttribute('data-name')
    if (n) setSelected(n === selected ? null : n)
  }

  return (
    <div onClick={onCardClick} style={{ display: 'contents' }}>
      <Renderer
        page={definePage(
          buildCatalogPage({
            filter,
            selectedName: selected,
            visibleZones,
            grouped,
            totals,
            kindLabel,
            kindBlurb,
            headerLabel,
            headerBlurb,
            nav: { data: navData, onEvent: onNavEvent },
            renderDemo,
          }),
        )}
      />
    </div>
  )
}

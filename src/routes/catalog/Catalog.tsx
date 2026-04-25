import { useMemo, useState } from 'react'
import { contracts, type Contract, type Kind } from 'virtual:ds-contracts'
import { Listbox, useControlState, navigateOnActivate, type Event, type NormalizedData, ROOT } from '../../ds'
import { demos } from './demos'

/**
 * Catalog — ds ui zone-first 감사 대시보드.
 *
 * 폴더 = zone 의 단일 진실 원천 (src/ds/core/INVARIANTS.md):
 *   collection · composite · control · overlay · entity · layout · drift
 * 좌측 sidebar 는 zone 분류, 우측 content 는 zone → component card 위계.
 */

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

export function Catalog() {
  const [filter, setFilter] = useState<Filter>('all')
  // mobile drawer는 CSS-only로 처리 (data-nav-open 토글만 JS, viewport 분기는 CSS).
  const [navOpen, setNavOpen] = useState(false)

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

  return (
    <main
      aria-roledescription="catalog-app"
      aria-label="Catalog"
      data-nav-open={navOpen ? 'true' : undefined}
    >
      <section aria-roledescription="body">
        <CatalogNav
          filter={filter}
          setFilter={(f) => { setFilter(f); setNavOpen(false) }}
          grouped={grouped}
          total={totals.total}
        />
        {navOpen && (
          <button
            type="button"
            aria-roledescription="scrim"
            aria-label="메뉴 닫기"
            onClick={() => setNavOpen(false)}
          />
        )}
        <section aria-roledescription="workspace">
          <header aria-roledescription="topbar">
            <button
              type="button"
              aria-label="메뉴 열기"
              aria-expanded={navOpen}
              aria-roledescription="nav-toggle"
              data-icon="menu"
              onClick={() => setNavOpen((v) => !v)}
            />
            <hgroup>
              <h1>{headerLabel}</h1>
              <p>{headerBlurb}</p>
            </hgroup>
            <dl aria-roledescription="catalog-stats">
              <div><dt>총</dt><dd>{totals.total}</dd></div>
              <div><dt>canonical</dt><dd data-tone="good">{totals.canonical}</dd></div>
              <div><dt>drift</dt><dd data-tone={totals.drift > 0 ? 'warn' : undefined}>{totals.drift}</dd></div>
              <div><dt>전부 통과</dt><dd data-tone="good">{totals.passAll}</dd></div>
              <div><dt>수렴률</dt><dd data-tone={totals.canonical / totals.total > 0.3 ? 'good' : 'warn'}>
                {totals.total ? `${Math.round((totals.canonical / totals.total) * 100)}%` : '—'}
              </dd></div>
            </dl>
          </header>
          <section aria-roledescription="content">
            {visibleZones.map((k) => {
                  const list = grouped[k]
                  return (
                    <section key={k} aria-roledescription="catalog-zone" aria-labelledby={`z-${k}`}>
                      <header>
                        <h2 id={`z-${k}`}>{kindLabel[k]}</h2>
                        <small>{list.length}</small>
                      </header>
                      <p>{kindBlurb[k]}</p>
                      <ul aria-roledescription="catalog-grid">
                        {list.map((c) => <li key={c.file}><Card contract={c} /></li>)}
                      </ul>
                    </section>
                  )
                })}
          </section>
        </section>
      </section>
    </main>
  )
}

function CatalogNav({
  filter, setFilter, grouped, total,
}: { filter: Filter; setFilter: (f: Filter) => void; grouped: Record<Kind, Contract[]>; total: number }) {
  const base = useMemo<NormalizedData>(() => {
    const items: { id: Filter; label: string; badge: number }[] = [
      { id: 'all', label: 'All', badge: total },
      ...kindOrder.map((k) => ({ id: k, label: kindLabel[k], badge: grouped[k].length })),
    ]
    const entities: NormalizedData['entities'] = {
      [ROOT]: { id: ROOT },
      __focus__: { id: '__focus__', data: { id: filter } },
    }
    for (const it of items) {
      entities[it.id] = { id: it.id, data: { label: it.label, badge: it.badge, selected: it.id === filter } }
    }
    return { entities, relationships: { [ROOT]: items.map((i) => i.id) } }
  }, [filter, grouped, total])

  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') setFilter(ev.id as Filter)
    })

  return (
    <nav aria-roledescription="sidebar" aria-label="Catalog navigation">
      <header>
        <strong>ds Catalog</strong>
        <small>{total} components</small>
      </header>
      <section aria-labelledby="sb-zones">
        <h3 id="sb-zones">zone</h3>
        <Listbox data={data} onEvent={onEvent} aria-label="zone 분류" />
      </section>
    </nav>
  )
}

function Card({ contract }: { contract: Contract }) {
  const { name, file, role, propsSignature, checks, score, callSites, kind } = contract
  const allPass = checks.every((c) => c.pass)
  const badge = allPass ? '✓' : `${checks.filter((c) => c.pass).length}/${checks.length}`
  const badgeTone = allPass ? 'good' : score >= 0.7 ? 'warn' : 'bad'

  return (
    <article aria-roledescription="catalog-card">
      <header>
        <h3>{name}</h3>
        <span data-badge data-tone={badgeTone}>{badge}</span>
        {role && <code>role=&quot;{role}&quot;</code>}
        <small>{callSites} 소비처</small>
      </header>
      <small aria-roledescription="card-path">{file.replace('/src/ds/ui/', '')}</small>
      <pre>{propsSignature}</pre>
      <Demo name={name} />
      <ul aria-roledescription="card-checks">
        {checks.map((c) => (
          <li key={c.id} data-pass={c.pass ? 'true' : 'false'}>
            {c.pass ? '✓' : '✗'} {c.label}
          </li>
        ))}
      </ul>
      {kind === 'drift' && <footer>zone 폴더 외부 — collection/composite/control/overlay/entity/layout 중 하나로 이동</footer>}
    </article>
  )
}

function Demo({ name }: { name: string }) {
  const Render = demos[name]
  return (
    <figure aria-roledescription="card-demo" aria-label={`${name} 예시`}>
      {Render ? <Render /> : <small>demo TBD</small>}
    </figure>
  )
}

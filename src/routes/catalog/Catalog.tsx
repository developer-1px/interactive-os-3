/** Catalog — ds ui 어휘 일람. 사이드바는 의존성 tier 순으로 정렬된 Tree. */
import { useMemo, useState, type ReactNode } from 'react'
import { contracts, type Contract, type Kind } from 'virtual:ds-contracts'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  ROOT, FOCUS, EXPANDED, type Event, type NormalizedData,
} from '../../ds'
import { demos } from './demos'
import { buildCatalogPage } from './build'
import { tierOf, tierLabel, tierOrder, type Tier } from './tiers'

const ALL_ID = 'all'
const tierId = (t: Tier) => `t:${t}`
const compId = (name: string) => `c:${name}`

type NavSelection =
  | { kind: 'all' }
  | { kind: 'tier'; tier: Tier }
  | { kind: 'component'; name: string }

const parseSelection = (id: string, byName: Map<string, Contract>): NavSelection => {
  if (id === ALL_ID) return { kind: 'all' }
  if (id.startsWith('t:')) return { kind: 'tier', tier: Number(id.slice(2)) as Tier }
  if (id.startsWith('c:')) {
    const name = id.slice(2)
    if (byName.has(name)) return { kind: 'component', name }
  }
  return { kind: 'all' }
}

const buildNav = (
  selection: NavSelection,
  grouped: Record<Tier, Contract[]>,
  total: number,
  expanded: Set<string>,
): NormalizedData => {
  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    [ALL_ID]: { id: ALL_ID, data: { label: 'All', badge: total } },
  }
  const rels: NormalizedData['relationships'] = { [ROOT]: [ALL_ID] }

  const focusedId =
    selection.kind === 'all' ? ALL_ID
    : selection.kind === 'tier' ? tierId(selection.tier)
    : compId(selection.name)

  for (const t of tierOrder) {
    const list = grouped[t]
    if (list.length === 0) continue
    const tid = tierId(t)
    entities[tid] = { id: tid, data: { label: `${t}. ${tierLabel[t]}`, badge: list.length } }
    const compIds: string[] = []
    for (const c of list) {
      const cid = compId(c.name)
      entities[cid] = { id: cid, data: { label: c.name } }
      compIds.push(cid)
    }
    rels[tid] = compIds
    rels[ROOT].push(tid)
  }

  entities[FOCUS] = { id: FOCUS, data: { id: focusedId } }
  entities[EXPANDED] = { id: EXPANDED, data: { ids: Array.from(expanded) } }

  return { entities, relationships: rels }
}

export function Catalog() {
  const grouped = useMemo(() => {
    const m: Record<Tier, Contract[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] }
    for (const c of contracts) m[tierOf(c.name, c.kind as Kind)].push(c)
    for (const t of tierOrder) m[t].sort((a, b) => a.name.localeCompare(b.name))
    return m
  }, [])

  const byName = useMemo(() => {
    const m = new Map<string, Contract>()
    for (const c of contracts) m.set(c.name, c)
    return m
  }, [])

  const [selection, setSelection] = useState<NavSelection>({ kind: 'all' })
  const [expanded] = useState<Set<string>>(() => new Set(tierOrder.map(tierId)))

  const visibleTiers: Tier[] =
    selection.kind === 'all'
      ? tierOrder.filter((t) => grouped[t].length > 0)
      : selection.kind === 'tier'
      ? [selection.tier]
      : [tierOf(selection.name, byName.get(selection.name)?.kind as Kind)]

  const focusContract: Contract | null =
    selection.kind === 'component' ? byName.get(selection.name) ?? null : null

  const headerLabel =
    selection.kind === 'all' ? 'Catalog'
    : selection.kind === 'tier' ? `${selection.tier}. ${tierLabel[selection.tier]}`
    : selection.name

  const navData0 = useMemo(
    () => buildNav(selection, grouped, contracts.length, expanded),
    [selection, grouped, expanded],
  )
  const [navData, navDispatch] = useControlState(navData0)
  const onNavEvent = (e: Event) => {
    navigateOnActivate(navData, e).forEach((ev) => {
      navDispatch(ev)
      if (ev.type === 'navigate' || ev.type === 'activate') {
        setSelection(parseSelection(ev.id, byName))
      }
    })
  }

  const renderDemo = (name: string): ReactNode => {
    const Render = demos[name]
    return Render ? <Render /> : undefined
  }

  return (
    <Renderer
      page={definePage(
        buildCatalogPage({
          focus: focusContract,
          visibleTiers,
          grouped,
          headerLabel,
          nav: { data: navData, onEvent: onNavEvent },
          renderDemo,
        }),
      )}
    />
  )
}

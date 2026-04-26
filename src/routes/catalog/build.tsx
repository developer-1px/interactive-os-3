/**
 * catalog build — sidebar | workspace 셸. 콘텐츠는 의존성 tier 순으로 일자 배치.
 *
 *   holyGrail( navSlot:'nav' | contentSlot:'content' )
 *     ⊕ ( focus 모드 ? catalogFocusCard : catalogTierSection × n )
 *     ⊕ sidebarAdmin( tier-grouped tree )
 *
 * 셸은 ds/layouts/holyGrail 로 수렴 — 자체 entities/relationships 손짜기 ❌.
 */
import type { ReactNode } from 'react'
import {
  merge,
  type Event, type NormalizedData,
} from '../../ds'
import { holyGrail } from '../../ds/layouts'
import { sidebarAdmin } from '../../ds/widgets/sidebar'
import type { Contract } from 'virtual:ds-contracts'
import { tierLabel, tierBlurb, type Tier } from './tiers'

export interface CatalogState {
  focus: Contract | null
  visibleTiers: Tier[]
  grouped: Record<Tier, Contract[]>
  headerLabel: string
  nav: { data: NormalizedData; onEvent: (e: Event) => void }
  renderDemo: (name: string) => ReactNode
}

const NARROW = '72rem'

/** route-internal content fragment factory — defineLayout/Widget 어디에도 속하지 않는다.
 *  Section + Header + Texts + Grid + Ui card cluster. Ui leaf 를 포함하므로 defineLayout
 *  으로 감싸지 않는다 (validation 위반). landmark owner 도 아니라 defineWidget 도 아님. */
const catalogTierSection = (props: {
  tier: Tier
  list: Contract[]
  renderDemo: (name: string) => ReactNode
}): NormalizedData => {
  const { tier, list, renderDemo } = props
  const sid = `t-${tier}`
  const hid = `th-${tier}`
  const gid = `tg-${tier}`
  const entities: NormalizedData['entities'] = {
    [sid]: { id: sid, data: { type: 'Section', flow: 'list', label: tierLabel[tier] } },
    [hid]: { id: hid, data: { type: 'Header', flow: 'cluster' } },
    [`tt-${tier}`]: { id: `tt-${tier}`, data: { type: 'Text', variant: 'h2', content: `${tier}. ${tierLabel[tier]}` } },
    [`tc-${tier}`]: { id: `tc-${tier}`, data: { type: 'Text', variant: 'small', content: String(list.length) } },
    [`tb-${tier}`]: { id: `tb-${tier}`, data: { type: 'Text', variant: 'muted', content: tierBlurb[tier] } },
    [gid]: { id: gid, data: { type: 'Grid', cols: 3, cardGrid: true } },
  }
  const cardIds: string[] = []
  for (const c of list) {
    const cid = `card-${c.name}`
    entities[cid] = cardEntity(c, renderDemo, false)
    cardIds.push(cid)
  }
  return {
    entities,
    relationships: {
      [sid]: [hid, `tb-${tier}`, gid],
      [hid]: [`tt-${tier}`, `tc-${tier}`],
      [gid]: cardIds,
    },
  }
}

/** focus 모드 단일 Ui leaf fragment. */
const catalogFocusCard = (props: {
  contract: Contract
  renderDemo: (name: string) => ReactNode
}): NormalizedData => ({
  entities: { [`card-${props.contract.name}`]: cardEntity(props.contract, props.renderDemo, true) },
  relationships: {},
})

const cardEntity = (
  c: Contract,
  renderDemo: (name: string) => ReactNode,
  selected: boolean,
): NormalizedData['entities'][string] => ({
  id: `card-${c.name}`,
  data: {
    type: 'Ui',
    component: 'ContractCard',
    props: {
      name: c.name,
      file: c.file,
      role: c.role,
      propsSignature: c.propsSignature,
      checks: c.checks,
      callSites: c.callSites,
      drift: c.kind === 'drift',
      selected,
      'data-name': c.name,
      demo: renderDemo(c.name),
    },
  },
})

export function buildCatalogPage(s: CatalogState): NormalizedData {
  const sidebar = sidebarAdmin({
    id: 'nav',
    label: 'ds 컴포넌트',
    tree: s.nav.data,
    onEvent: s.nav.onEvent,
  })
  const shell = holyGrail({
    label: s.headerLabel,
    navSlot: 'nav',
    contentSlot: 'content',
    narrow: NARROW,
    roledescription: 'catalog-page',
  })

  if (s.focus) {
    const focus = catalogFocusCard({ contract: s.focus, renderDemo: s.renderDemo })
    return merge(
      shell,
      focus,
      { entities: {}, relationships: { content: [`card-${s.focus.name}`] } },
      sidebar,
    )
  }

  const tiers = s.visibleTiers.filter((t) => s.grouped[t].length > 0)
  const fragments = tiers.map((t) =>
    catalogTierSection({ tier: t, list: s.grouped[t], renderDemo: s.renderDemo }),
  )
  const contentChildren = tiers.map((t) => `t-${t}`)

  return merge(
    shell,
    ...fragments,
    { entities: {}, relationships: { content: contentChildren } },
    sidebar,
  )
}

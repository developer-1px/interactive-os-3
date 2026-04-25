import type { ReactNode } from 'react'
import { ROOT, type Event, type NormalizedData } from '../../ds'
import type { Contract, Kind } from 'virtual:ds-contracts'

export interface CatalogState {
  filter: Kind | 'all'
  selectedName: string | null
  visibleZones: Kind[]
  grouped: Record<Kind, Contract[]>
  totals: { total: number; canonical: number; drift: number; passAll: number }
  kindLabel: Record<Kind, string>
  kindBlurb: Record<Kind, string>
  headerLabel: string
  headerBlurb: string
  nav: { data: NormalizedData; onEvent: (e: Event) => void }
  renderDemo: (name: string) => ReactNode
}

export function buildCatalogPage(s: CatalogState): NormalizedData {
  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    page: { id: 'page', data: { type: 'Row', flow: 'list', roledescription: 'catalog-page', label: 'Catalog' } },

    nav: { id: 'nav', data: { type: 'Nav', flow: 'list', emphasis: 'sunk', width: 240, label: 'Catalog navigation' } },
    navTitle: { id: 'navTitle', data: { type: 'Text', variant: 'small', content: 'ds Catalog' } },
    navList: { id: 'navList', data: { type: 'Ui', component: 'Listbox', props: { data: s.nav.data, onEvent: s.nav.onEvent, 'aria-label': 'zone 분류' } } },

    workspace: { id: 'workspace', data: { type: 'Main', flow: 'list', grow: true, label: s.headerLabel } },
    topbar: { id: 'topbar', data: { type: 'Header', flow: 'cluster' } },
    topTitleCol: { id: 'topTitleCol', data: { type: 'Column', flow: 'list', grow: true } },
    topTitle: { id: 'topTitle', data: { type: 'Text', variant: 'h1', content: s.headerLabel } },
    topBlurb: { id: 'topBlurb', data: { type: 'Text', variant: 'muted', content: s.headerBlurb } },
    topStats: { id: 'topStats', data: { type: 'Row', flow: 'cluster' } },
    statTotal:    { id: 'statTotal',    data: { type: 'Text', variant: 'small', content: `총 ${s.totals.total}` } },
    statCanonical:{ id: 'statCanonical',data: { type: 'Text', variant: 'small', content: `canonical ${s.totals.canonical}` } },
    statDrift:    { id: 'statDrift',    data: { type: 'Text', variant: 'small', content: `drift ${s.totals.drift}` } },
    statPass:     { id: 'statPass',     data: { type: 'Text', variant: 'small', content: `통과 ${s.totals.passAll}` } },
    statRate:     {
      id: 'statRate',
      data: {
        type: 'Text',
        variant: 'small',
        content: s.totals.total ? `수렴률 ${Math.round((s.totals.canonical / s.totals.total) * 100)}%` : '수렴률 —',
      },
    },

    content: { id: 'content', data: { type: 'Section', flow: 'list', grow: true } },
  }

  const relationships: NormalizedData['relationships'] = {
    [ROOT]: ['page'],
    page: ['nav', 'workspace'],
    nav: ['navTitle', 'navList'],
    workspace: ['topbar', 'content'],
    topbar: ['topTitleCol', 'topStats'],
    topTitleCol: ['topTitle', 'topBlurb'],
    topStats: ['statTotal', 'statCanonical', 'statDrift', 'statPass', 'statRate'],
    content: [],
  }

  const zoneIds: string[] = []
  for (const k of s.visibleZones) {
    const list = s.grouped[k]
    if (list.length === 0) continue
    const zid = `z-${k}`
    const hdr = `zh-${k}`
    const ttl = `zt-${k}`
    const cnt = `zc-${k}`
    const blb = `zb-${k}`
    const grid = `zg-${k}`
    entities[zid] = { id: zid, data: { type: 'Section', flow: 'list', label: s.kindLabel[k] } }
    entities[hdr] = { id: hdr, data: { type: 'Header', flow: 'cluster' } }
    entities[ttl] = { id: ttl, data: { type: 'Text', variant: 'h2', content: s.kindLabel[k] } }
    entities[cnt] = { id: cnt, data: { type: 'Text', variant: 'small', content: String(list.length) } }
    entities[blb] = { id: blb, data: { type: 'Text', variant: 'muted', content: s.kindBlurb[k] } }
    entities[grid] = { id: grid, data: { type: 'Grid', cols: 3 } }
    relationships[zid] = [hdr, blb, grid]
    relationships[hdr] = [ttl, cnt]
    const cardIds: string[] = []
    for (const c of list) {
      const cid = `card-${c.name}`
      entities[cid] = {
        id: cid,
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
            selected: c.name === s.selectedName,
            'data-name': c.name,
            demo: s.renderDemo(c.name),
          },
        },
      }
      cardIds.push(cid)
    }
    relationships[grid] = cardIds
    zoneIds.push(zid)
  }
  relationships.content = zoneIds

  return { entities, relationships }
}

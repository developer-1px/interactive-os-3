import type { ReactNode } from 'react'
import { ROOT, type Event, type NormalizedData } from '../../ds'
import type { AuditData } from 'virtual:ds-audit'

export interface AtlasState {
  filter: string  // 'all' | 'leaks' | <file path>
  exports: AuditData['exports']
  callSites: AuditData['callSites']
  leaks: AuditData['leaks']
  byFile: [string, AuditData['exports']][]
  nav: { data: NormalizedData; onEvent: (e: Event) => void }
  presetTools: { data: NormalizedData; onEvent: (e: Event) => void }
  renderDemo: (name: string) => ReactNode
}

export function buildAtlasPage(s: AtlasState): NormalizedData {
  const showLeaks = s.filter === 'leaks'
  const visibleFiles = s.filter === 'all' || showLeaks
    ? s.byFile
    : s.byFile.filter(([f]) => f === s.filter)

  const headerLabel = s.filter === 'all'
    ? 'Atlas'
    : showLeaks ? 'Leak Report'
    : s.filter.replace('/src/ds/fn/', '')

  const headerBlurb = showLeaks
    ? 'style/widgets/** 에서 fn/ 을 거치지 않은 리터럴·직접 var 참조. 0에 가까울수록 메타-DS.'
    : 'fn/ 레이어가 메타-DS인지 시각으로 판정'

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    page: { id: 'page', data: { type: 'Row', flow: 'list', roledescription: 'atlas-page', label: 'Atlas' } },

    nav: { id: 'nav', data: { type: 'Nav', flow: 'list', emphasis: 'sunk', width: 240, label: 'Atlas navigation' } },
    navTitle: { id: 'navTitle', data: { type: 'Text', variant: 'small', content: 'ds Atlas' } },
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
    entities.leaksCard = {
      id: 'leaksCard',
      data: { type: 'Ui', component: 'LeakTable', props: { leaks: s.leaks } },
    }
    relationships.content = ['leaksCard']
  } else {
    const groupIds: string[] = []
    for (const [file, list] of visibleFiles) {
      const gid = `g-${file}`
      const hdr = `gh-${file}`
      const grid = `gr-${file}`
      const ttl = `gt-${file}`
      const cnt = `gc-${file}`
      entities[gid] = { id: gid, data: { type: 'Section', flow: 'list', label: file.replace('/src/ds/fn/', '') } }
      entities[hdr] = { id: hdr, data: { type: 'Header', flow: 'cluster' } }
      entities[ttl] = { id: ttl, data: { type: 'Text', variant: 'h2', content: file.replace('/src/ds/fn/', '') } }
      entities[cnt] = { id: cnt, data: { type: 'Text', variant: 'small', content: String(list.length) } }
      entities[grid] = { id: grid, data: { type: 'Grid', cols: 3 } }
      relationships[gid] = [hdr, grid]
      relationships[hdr] = [ttl, cnt]
      const cardIds: string[] = []
      for (const fn of list) {
        const cid = `card-${fn.name}`
        entities[cid] = {
          id: cid,
          data: {
            type: 'Ui',
            component: 'FnCard',
            props: {
              name: fn.name,
              doc: fn.doc,
              signature: fn.signature,
              sites: s.callSites[fn.name] ?? [],
              demo: s.renderDemo(fn.name),
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

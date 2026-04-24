import { useMemo, useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../../ds'
import { videos, roleCategories, certCategories } from '../data'

type Mode = 'role' | 'cert'

export function VideoOrder() {
  const [mode, setMode] = useState<Mode>('role')
  const categories = mode === 'role' ? roleCategories : certCategories
  const [subId, setSubId] = useState(categories[0]?.id ?? '')
  const current = useMemo(() => categories.find((c) => c.id === subId) ?? categories[0], [categories, subId])

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    sec: { id: 'sec', data: { type: 'Section', heading: { content: '영상 순서 관리' } } },

    modeTabs: { id: 'modeTabs', data: { type: 'Ui', component: 'TabList', props: { 'aria-label': '순서 기준' } } },
    modeRole: { id: 'modeRole', data: {
      type: 'Ui', component: 'Tab',
      props: { selected: mode === 'role', onClick: () => { setMode('role'); setSubId(roleCategories[0].id) } },
      content: '역할별',
    } },
    modeCert: { id: 'modeCert', data: {
      type: 'Ui', component: 'Tab',
      props: { selected: mode === 'cert', onClick: () => { setMode('cert'); setSubId(certCategories[0].id) } },
      content: '코스별',
    } },

    panel: { id: 'panel', data: { type: 'Ui', component: 'TabPanel', props: { 'aria-label': mode === 'role' ? '역할별' : '코스별' } } },
    subTabs: { id: 'subTabs', data: {
      type: 'Ui', component: 'TabList',
      props: { 'aria-label': mode === 'role' ? '역할 선택' : '코스 선택' },
    } },
    ...subTabNodes(categories, subId, setSubId),

    orderCol: { id: 'orderCol', data: { type: 'Column', flow: 'list' } },
    orderList: { id: 'orderList', data: { type: 'Column', flow: 'list', label: `${current?.name ?? ''} 영상 순서` } },
    ...videoOrderNodes(videos),

    footer: { id: 'footer', data: { type: 'Footer', flow: 'split' } },
    footNote: { id: 'footNote', data: { type: 'Text', variant: 'small', content: '⠿ 드래그하여 순서를 변경한 후 저장하세요' } },
    saveBtn: { id: 'saveBtn', data: { type: 'Ui', component: 'Button', content: '저장' } },
  }

  const relationships: NormalizedData['relationships'] = {
    [ROOT]: ['sec'],
    sec: ['modeTabs', 'panel'],
    modeTabs: ['modeRole', 'modeCert'],
    panel: ['subTabs', 'orderCol'],
    subTabs: categories.map((c) => `sub-${c.id}`),
    orderCol: ['orderList', 'footer'],
    orderList: videos.map((v, i) => `vo-${v.id}-${i}`),
    ...videoOrderRels(videos),
    footer: ['footNote', 'saveBtn'],
  }

  return <Renderer page={definePage({ entities, relationships })} />
}

function subTabNodes(
  categories: typeof roleCategories | typeof certCategories,
  subId: string, setSubId: (id: string) => void,
) {
  const out: NormalizedData['entities'] = {}
  for (const c of categories) {
    out[`sub-${c.id}`] = {
      id: `sub-${c.id}`,
      data: {
        type: 'Ui', component: 'Tab',
        props: { selected: c.id === subId, onClick: () => setSubId(c.id) },
        content: c.name,
      },
    }
  }
  return out
}

function videoOrderNodes(items: typeof videos) {
  const out: NormalizedData['entities'] = {}
  items.forEach((v, i) => {
    const key = `vo-${v.id}-${i}`
    out[key] = { id: key, data: { type: 'Row', flow: 'cluster' } }
    out[`${key}-h`] = { id: `${key}-h`, data: { type: 'Text', variant: 'body', content: '⠿' } }
    out[`${key}-n`] = { id: `${key}-n`, data: { type: 'Text', variant: 'strong', content: `${i + 1}.` } }
    out[`${key}-t`] = { id: `${key}-t`, data: { type: 'Text', variant: 'body', content: v.title, grow: true } }
    out[`${key}-d`] = { id: `${key}-d`, data: { type: 'Text', variant: 'small', content: v.duration } }
    out[`${key}-l`] = { id: `${key}-l`, data: { type: 'Text', variant: 'small', content: v.level } }
  })
  return out
}

function videoOrderRels(items: typeof videos) {
  const out: NormalizedData['relationships'] = {}
  items.forEach((v, i) => {
    const key = `vo-${v.id}-${i}`
    out[key] = [`${key}-h`, `${key}-n`, `${key}-t`, `${key}-d`, `${key}-l`]
  })
  return out
}

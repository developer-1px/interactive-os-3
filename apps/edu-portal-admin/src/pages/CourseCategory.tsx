import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
import { certCategories as initial, type CertCategory } from '../entities/data'

type Tone = 'success' | 'info' | 'warning' | 'danger' | 'neutral'

const toneByLevel: Record<CertCategory['level'], Tone> = {
  NCA: 'success',
  NCP: 'info',
  NCE: 'danger',
  ETC: 'neutral',
}

const levelLabel: Record<CertCategory['level'], string> = {
  NCA: '입문',
  NCP: '실무',
  NCE: '심화',
  ETC: '확장',
}

export function CourseCategory() {
  const [list, setList] = useState(initial)
  const toggle = (id: string) =>
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)))
  const edit = (_id: string) => undefined
  const remove = (_id: string) => undefined

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    page: { id: 'page', data: { type: 'Row', flow: 'form' } },

    main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },

    list: { id: 'list', data: { type: 'Column', flow: 'list', label: '코스 카테고리' } },
    ...certCardNodes(list, toggle, edit, remove),
    addBtn: { id: 'addBtn', data: { type: 'Ui', component: 'Button', props: { 'data-icon': 'plus', variant: 'primary' }, content: '새 코스 카테고리 추가' } },

    aside:     { id: 'aside',     data: { type: 'Aside', flow: 'form', width: 300 } },
    infoSec:   { id: 'infoSec',   data: { type: 'Section', labelledBy: 'info-h' } },
    infoH:     { id: 'infoH',     data: { type: 'Text', variant: 'h3', content: '안내' } },
    infoBody:  { id: 'infoBody',  data: {
      type: 'Ui', component: 'Block',
      content: (
        <ul>
          <li><strong>[+ 코스 카테고리 추가]</strong>로 NCA·NCP·NCE 외 새 코스를 등록합니다.</li>
          <li><strong>노출/숨김</strong> 토글로 메인 화면 타일 노출을 즉시 제어합니다.</li>
          <li><strong>연결 영상 수</strong>는 코스 태그 기준으로 자동 집계됩니다.</li>
          <li>NCA·NCP·NCE 기본 3개 항목은 삭제할 수 없습니다.</li>
        </ul>
      ),
    } },

    statsSec:  { id: 'statsSec',  data: { type: 'Section', labelledBy: 'stats-h' } },
    statsH:    { id: 'statsH',    data: { type: 'Text', variant: 'h3', content: '코스별 현황' } },
    statsBody: { id: 'statsBody', data: {
      type: 'Ui', component: 'Block',
      content: <CourseStats list={list} />,
    } },
  }

  const relationships: NormalizedData['relationships'] = {
    [ROOT]: ['page'],
    page: ['main', 'aside'],
    main: ['list', 'addBtn'],
    list: list.map((c) => `card-${c.id}`),
    aside: ['infoSec', 'statsSec'],
    infoSec: ['infoH', 'infoBody'],
    statsSec: ['statsH', 'statsBody'],
  }

  return <Renderer page={definePage({ entities, relationships })} />
}

function certCardNodes(
  list: CertCategory[],
  toggle: (id: string) => void,
  edit: (id: string) => void,
  remove: (id: string) => void,
) {
  const out: NormalizedData['entities'] = {}
  for (const c of list) {
    out[`card-${c.id}`] = {
      id: `card-${c.id}`,
      data: {
        type: 'Ui', component: 'CourseCard',
        props: {
          id: c.id,
          abbr: c.name,
          name: c.desc.split(' — ')[0] ?? c.desc,
          desc: c.desc.split(' — ')[1] ?? '',
          variant: toneByLevel[c.level],
          meta: `${levelLabel[c.level]} · 영상 ${c.videoIds.length}개`,
          visible: c.visible,
          locked: c.locked,
          onToggleVisible: toggle,
          onEdit: edit,
          onDelete: remove,
        },
      },
    }
  }
  return out
}

function CourseStats({ list }: { list: CertCategory[] }) {
  const tones: Record<string, 'success' | 'info' | 'danger' | 'neutral'> = {
    NCA: 'success', NCP: 'info', NCE: 'danger', ETC: 'neutral',
  }
  return (
    <dl>
      {list.map((c) => (
        <div key={c.id}>
          <dt><mark data-variant={tones[c.level]}>{c.name}</mark></dt>
          <dd>{c.visible ? `영상 ${c.videoIds.length}개` : '숨김'}</dd>
        </div>
      ))}
    </dl>
  )
}

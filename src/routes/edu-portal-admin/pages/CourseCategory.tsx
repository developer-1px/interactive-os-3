import { useState } from 'react'
import { Renderer, definePage, ROOT, Switch, type NormalizedData } from '../../../ds'
import { certCategories as initial, type CertCategory } from '../data'

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

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    page: { id: 'page', data: { type: 'Row', flow: 'form' } },

    main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },

    list: { id: 'list', data: { type: 'Column', flow: 'list', label: '코스 카테고리' } },
    ...certCardNodes(list, toggle),
    addBtn: { id: 'addBtn', data: { type: 'Ui', component: 'Button', props: { 'data-icon': 'plus' }, content: '새 코스 카테고리 추가' } },

    aside:     { id: 'aside',     data: { type: 'Aside', flow: 'form', width: 300 } },
    infoSec:   { id: 'infoSec',   data: { type: 'Section', labelledBy: 'info-h' } },
    infoH:     { id: 'infoH',     data: { type: 'Text', variant: 'h3', content: '안내' } },
    infoBody:  { id: 'infoBody',  data: {
      type: 'Text', variant: 'body',
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
      type: 'Text', variant: 'body',
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

function certCardNodes(list: CertCategory[], toggle: (id: string) => void) {
  const out: NormalizedData['entities'] = {}
  for (const c of list) {
    out[`card-${c.id}`] = {
      id: `card-${c.id}`,
      data: {
        type: 'Ui', component: 'CourseCard',
        props: {
          abbr: c.name,
          name: c.desc.split(' — ')[0] ?? c.desc,
          desc: c.desc.split(' — ')[1] ?? '',
          tone: toneByLevel[c.level],
          meta: <mark data-tone="info">{levelLabel[c.level]} · 영상 {c.videoIds.length}개</mark>,
          actions: (
            <>
              <Switch
                checked={c.visible}
                aria-label={`${c.name} 노출`}
                onClick={() => toggle(c.id)}
              />
              <button type="button">수정</button>
              {!c.locked && <button type="button">삭제</button>}
            </>
          ),
          footer: c.visible ? '노출 중' : '숨김',
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
          <dt><mark data-tone={tones[c.level]}>{c.name}</mark></dt>
          <dd>{c.visible ? `영상 ${c.videoIds.length}개` : '숨김'}</dd>
        </div>
      ))}
    </dl>
  )
}

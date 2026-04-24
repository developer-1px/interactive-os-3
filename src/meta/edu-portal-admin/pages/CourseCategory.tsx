import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../../ds'
import { certCategories as initial } from '../data'

export function CourseCategory() {
  const [list, setList] = useState(initial)
  const toggle = (id: string) =>
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)))

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    page: { id: 'page', data: { type: 'Row', flow: 'form' } },

    main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },
    sec: { id: 'sec', data: { type: 'Section', labelledBy: 'cc-h' } },
    secHeader: { id: 'secHeader', data: { type: 'Header', flow: 'split' } },
    secH: { id: 'secH', data: { type: 'Text', variant: 'h2', content: '코스 카테고리 목록' } },
    secSub: { id: 'secSub', data: { type: 'Text', variant: 'small',
      content: 'NCA·NCP·NCE는 삭제 불가 · 추가 항목은 삭제 가능' } },

    list: { id: 'list', data: { type: 'Column', flow: 'list' } },
    ...certItemNodes(list, toggle),
    addBtn: { id: 'addBtn', data: { type: 'Ui', component: 'Button', content: '+ 새 코스 카테고리 추가' } },

    aside: { id: 'aside', data: { type: 'Aside', flow: 'form', width: 300, labelledBy: 'ccHelp-h' } },
    asideH: { id: 'asideH', data: { type: 'Text', variant: 'h3', content: '안내' } },
    asideBody: { id: 'asideBody', data: {
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
  }

  const relationships: NormalizedData['relationships'] = {
    [ROOT]: ['page'],
    page: ['main', 'aside'],
    main: ['sec'],
    sec: ['secHeader', 'list', 'addBtn'],
    secHeader: ['secH', 'secSub'],
    list: list.map((c) => `disc-${c.id}`),
    ...certItemRels(list),
    aside: ['asideH', 'asideBody'],
  }

  return <Renderer page={definePage({ entities, relationships })} />
}

function certItemNodes(list: typeof initial, toggle: (id: string) => void) {
  const out: NormalizedData['entities'] = {}
  for (const c of list) {
    out[`disc-${c.id}`] = {
      id: `disc-${c.id}`,
      data: {
        type: 'Ui', component: 'Disclosure',
        props: { summary: <><strong>{c.name}</strong><span> — {c.desc}</span><small> 영상 {c.videoCount}개</small></> },
      },
    }
    out[`row-${c.id}`] = { id: `row-${c.id}`, data: { type: 'Row', flow: 'cluster' } }
    out[`sw-${c.id}`] = {
      id: `sw-${c.id}`,
      data: {
        type: 'Ui', component: 'Switch',
        props: { checked: c.visible, onClick: () => toggle(c.id), 'aria-label': `${c.name} 노출` },
      },
    }
    out[`swLbl-${c.id}`] = { id: `swLbl-${c.id}`, data: { type: 'Text', variant: 'body', content: c.visible ? '노출' : '숨김' } }
    out[`edit-${c.id}`] = { id: `edit-${c.id}`, data: { type: 'Ui', component: 'Button', content: '수정' } }
    if (!c.locked) {
      out[`del-${c.id}`] = { id: `del-${c.id}`, data: { type: 'Ui', component: 'Button', content: '삭제' } }
    }
  }
  return out
}

function certItemRels(list: typeof initial) {
  const out: NormalizedData['relationships'] = {}
  for (const c of list) {
    const row: string[] = [`sw-${c.id}`, `swLbl-${c.id}`, `edit-${c.id}`]
    if (!c.locked) row.push(`del-${c.id}`)
    out[`disc-${c.id}`] = [`row-${c.id}`]
    out[`row-${c.id}`] = row
  }
  return out
}

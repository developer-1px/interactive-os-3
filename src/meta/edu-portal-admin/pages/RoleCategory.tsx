import { useState } from 'react'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../../ds'
import { roleCategories as initial } from '../data'

export function RoleCategory() {
  const [list, setList] = useState(initial)
  const toggle = (id: string) =>
    setList(list.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)))

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    page: { id: 'page', data: { type: 'Row', flow: 'form' } },

    main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },
    sec: { id: 'sec', data: { type: 'Section', labelledBy: 'sec-h' } },
    secHeader: { id: 'secHeader', data: { type: 'Header', flow: 'split' } },
    secH: { id: 'secH', data: { type: 'Text', variant: 'h2', content: '역할 카테고리 목록' } },
    secSub: { id: 'secSub', data: { type: 'Text', variant: 'small', content: '드래그로 순서 변경' } },

    rolesList: { id: 'rolesList', data: { type: 'Column', flow: 'list', label: '역할 카테고리' } },
    ...roleItemNodes(list, toggle),

    addBtn: { id: 'addBtn', data: { type: 'Ui', component: 'Button', content: '+ 새 역할 카테고리 추가' } },

    aside: { id: 'aside', data: { type: 'Aside', flow: 'form', width: 300, labelledBy: 'aside-h' } },
    asideH: { id: 'asideH', data: { type: 'Text', variant: 'h3', content: '안내' } },
    asideBody: { id: 'asideBody', data: {
      type: 'Text', variant: 'body',
      content: (
        <ul>
          <li><strong>드래그</strong>로 카테고리 노출 순서를 변경할 수 있습니다.</li>
          <li><strong>노출/숨김</strong> 토글로 메인 화면 노출 여부를 즉시 제어합니다.</li>
          <li>카테고리 <strong>아이콘</strong>을 클릭하면 변경할 수 있습니다.</li>
          <li>카테고리 삭제 시 소속 영상은 삭제되지 않습니다.</li>
        </ul>
      ),
    } },
  }

  const relationships: NormalizedData['relationships'] = {
    [ROOT]: ['page'],
    page: ['main', 'aside'],
    main: ['sec'],
    sec: ['secHeader', 'rolesList', 'addBtn'],
    secHeader: ['secH', 'secSub'],
    rolesList: list.map((c) => `item-${c.id}`),
    ...roleItemRels(list),
    aside: ['asideH', 'asideBody'],
  }

  return <Renderer page={definePage({ entities, relationships })} />
}

function roleItemNodes(list: typeof initial, toggle: (id: string) => void) {
  const out: NormalizedData['entities'] = {}
  for (const c of list) {
    out[`item-${c.id}`] = { id: `item-${c.id}`, data: { type: 'Row', flow: 'cluster' } }
    out[`handle-${c.id}`] = { id: `handle-${c.id}`, data: { type: 'Text', variant: 'body', content: '⠿' } }
    out[`icon-${c.id}`] = { id: `icon-${c.id}`, data: { type: 'Text', variant: 'body', content: c.icon, label: '아이콘' } as Record<string, unknown> }
    out[`body-${c.id}`] = { id: `body-${c.id}`, data: { type: 'Column', flow: 'list', grow: true } }
    out[`name-${c.id}`] = { id: `name-${c.id}`, data: { type: 'Text', variant: 'h3', content: c.name } }
    out[`desc-${c.id}`] = { id: `desc-${c.id}`, data: { type: 'Text', variant: 'small', content: c.desc } }
    out[`count-${c.id}`] = { id: `count-${c.id}`, data: { type: 'Text', variant: 'small', content: `영상 ${c.videoCount}개` } }

    out[`toggleRow-${c.id}`] = { id: `toggleRow-${c.id}`, data: { type: 'Row', flow: 'cluster' } }
    out[`switch-${c.id}`] = {
      id: `switch-${c.id}`,
      data: {
        type: 'Ui', component: 'Switch',
        props: { checked: c.visible, onClick: () => toggle(c.id), 'aria-label': `${c.name} 노출` },
      },
    }
    out[`switchLbl-${c.id}`] = { id: `switchLbl-${c.id}`, data: { type: 'Text', variant: 'body', content: c.visible ? '노출' : '숨김' } }

    out[`edit-${c.id}`] = { id: `edit-${c.id}`, data: { type: 'Ui', component: 'Button', content: '수정' } }
    out[`del-${c.id}`]  = { id: `del-${c.id}`,  data: { type: 'Ui', component: 'Button', content: '삭제' } }
  }
  return out
}

function roleItemRels(list: typeof initial) {
  const out: NormalizedData['relationships'] = {}
  for (const c of list) {
    out[`item-${c.id}`] = [`handle-${c.id}`, `icon-${c.id}`, `body-${c.id}`, `count-${c.id}`, `toggleRow-${c.id}`, `edit-${c.id}`, `del-${c.id}`]
    out[`body-${c.id}`] = [`name-${c.id}`, `desc-${c.id}`]
    out[`toggleRow-${c.id}`] = [`switch-${c.id}`, `switchLbl-${c.id}`]
  }
  return out
}

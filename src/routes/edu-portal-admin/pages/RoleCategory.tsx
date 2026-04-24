import { useState } from 'react'
import { Renderer, definePage, ROOT, Switch, type NormalizedData } from '../../../ds'
import { roleCategories as initial, type RoleCategory as RoleCategoryT } from '../data'

export function RoleCategory() {
  const [list, setList] = useState(initial)
  const toggle = (id: string) =>
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)))

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    page: { id: 'page', data: { type: 'Row', flow: 'form' } },

    main: { id: 'main', data: { type: 'Column', flow: 'form', grow: true } },

    rolesList: { id: 'rolesList', data: { type: 'Column', flow: 'list', label: '역할 카테고리' } },
    ...roleCardNodes(list, toggle),

    addBtn: { id: 'addBtn', data: { type: 'Ui', component: 'Button', props: { 'data-icon': 'plus' }, content: '새 역할 카테고리 추가' } },

    aside: { id: 'aside', data: { type: 'Aside', flow: 'form', width: 300 } },
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
    main: ['rolesList', 'addBtn'],
    rolesList: list.map((c) => `card-${c.id}`),
    aside: ['asideH', 'asideBody'],
  }

  return <Renderer page={definePage({ entities, relationships })} />
}

function roleCardNodes(list: RoleCategoryT[], toggle: (id: string) => void) {
  const out: NormalizedData['entities'] = {}
  for (const c of list) {
    out[`card-${c.id}`] = {
      id: `card-${c.id}`,
      data: {
        type: 'Ui', component: 'RoleCard',
        props: {
          icon: c.icon,
          name: c.name,
          desc: c.desc,
          meta: <mark data-tone="info">영상 {c.videoCount}개</mark>,
          actions: (
            <>
              <Switch
                checked={c.visible}
                aria-label={`${c.name} 노출`}
                onClick={() => toggle(c.id)}
              />
              <button type="button">수정</button>
              <button type="button">삭제</button>
            </>
          ),
        },
      },
    }
  }
  return out
}

import { useRouter, useRouterState } from '@tanstack/react-router'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
import { activePage, PAGE_PATHS, PAGE_TITLES } from './data'

/**
 * EPA Topbar.
 * - sub가 없으면 title Column 래퍼를 만들지 않는다 (single-child 방지).
 * - 페이지별 action이 정의된 경우에만 actions Row를 만든다 (single-child 방지).
 * - action 라벨/대상은 PAGE_TITLES에서 페이지별로 선언적으로 결정한다.
 */
export function Topbar() {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const page = activePage(pathname)
  const t = PAGE_TITLES[page]
  const action = t.action

  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    topbar: { id: 'topbar', data: { type: 'Header', roledescription: 'topbar', flow: 'split' } },
    h1:     { id: 'h1',     data: { type: 'Text', variant: 'h1', content: t.title } },
  }
  const topbarKids: string[] = []

  if (t.sub) {
    entities.title = { id: 'title', data: { type: 'Column', flow: 'list', grow: true } }
    entities.sub = { id: 'sub', data: { type: 'Text', variant: 'muted', content: t.sub } }
    topbarKids.push('title')
  } else {
    topbarKids.push('h1')
  }

  if (action) {
    entities.action = {
      id: 'action',
      data: {
        type: 'Ui', component: 'Button',
        props: {
          onClick: () => router.navigate({ to: PAGE_PATHS[action.to] }),
          'data-icon': action.icon,
        },
        content: action.label,
      },
    }
    topbarKids.push('action')
  }

  const relationships: NormalizedData['relationships'] = {
    [ROOT]: ['topbar'],
    topbar: topbarKids,
  }
  if (t.sub) relationships.title = ['h1', 'sub']

  return <Renderer page={definePage({ entities, relationships })} />
}

import { useRouter, useRouterState } from '@tanstack/react-router'
import { Renderer, definePage, ROOT, type NormalizedData } from '../../ds'
import { activePage, PAGE_PATHS, PAGE_TITLES } from './data'

export function Topbar() {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const page = activePage(pathname)
  const t = PAGE_TITLES[page]
  const onEditScreen = page === 'video-new'
  const onAction = () =>
    router.navigate({ to: onEditScreen ? PAGE_PATHS['video-list'] : PAGE_PATHS['video-new'] })

  const data: NormalizedData = {
    entities: {
      [ROOT]:   { id: ROOT, data: {} },
      topbar:   { id: 'topbar',  data: { type: 'Header', roledescription: 'topbar', flow: 'split' } },
      title:    { id: 'title',   data: { type: 'Column', flow: 'list', grow: true } },
      h1:       { id: 'h1',      data: { type: 'Text', variant: 'h1', content: t.title } },
      sub:      { id: 'sub',     data: { type: 'Text', variant: 'muted', content: t.sub } },
      actions:  { id: 'actions', data: { type: 'Row', roledescription: 'actions', flow: 'cluster' } },
      action:   {
        id: 'action',
        data: {
          type: 'Ui', component: 'Button',
          props: { onClick: onAction },
          content: onEditScreen ? '← 목록으로' : '+ 영상 등록',
        },
      },
    },
    relationships: {
      [ROOT]:  ['topbar'],
      topbar:  ['title', 'actions'],
      title:   t.sub ? ['h1', 'sub'] : ['h1'],
      actions: ['action'],
    },
  }
  return <Renderer page={definePage(data)} />
}

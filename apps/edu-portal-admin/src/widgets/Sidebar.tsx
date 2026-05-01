import { useMemo } from 'react'
import { useRouter, useRouterState } from '@tanstack/react-router'
import {
  Renderer, definePage, sidebarAdmin, useControlState, navigateOnActivate,
  ROOT, EXPANDED, type UiEvent, type NormalizedData,
} from '@p/ds'
import { activePage, navItems, PAGE_PATHS, type PageId } from '../entities/data'

const SECTIONS = ['메인', '콘텐츠', '설정'] as const

function buildNavTree(page: PageId): NormalizedData {
  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
  }
  const sectionIds: string[] = []
  for (const section of SECTIONS) {
    const sid = `sec.${section}`
    sectionIds.push(sid)
    entities[sid] = { id: sid, data: { label: section, kind: 'group', disabled: true } }
    for (const it of navItems.filter((n) => n.section === section)) {
      entities[it.id] = {
        id: it.id,
        data: { label: it.label, icon: it.icon, badge: it.badge, selected: it.id === page },
      }
    }
  }
  const relationships: NormalizedData['relationships'] = { [ROOT]: sectionIds }
  for (const section of SECTIONS) {
    const sid = `sec.${section}`
    relationships[sid] = navItems.filter((n) => n.section === section).map((n) => n.id)
  }
  entities[EXPANDED] = { id: EXPANDED, data: { ids: sectionIds } }
  return { entities, relationships }
}

export function Sidebar() {
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const page = activePage(pathname)
  const tree0 = useMemo(() => buildNavTree(page), [page])
  const [tree, dispatch] = useControlState(tree0)

  const onEvent = (e: UiEvent) => {
    navigateOnActivate(tree, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') {
        const target = PAGE_PATHS[ev.id as PageId]
        if (target) router.navigate({ to: target })
      }
    })
  }

  const sidebarPage = useMemo(() => {
    const frag = sidebarAdmin({
      id: 'edu-sidebar',
      label: '관리도구 네비게이션',
      brand: '교육 포털',
      tree,
      onEvent,
    })
    return definePage({
      entities: { [ROOT]: { id: ROOT, data: {} }, ...frag.entities },
      relationships: { [ROOT]: ['edu-sidebar'], ...frag.relationships },
    })
  }, [tree])

  return <Renderer page={sidebarPage} />
}

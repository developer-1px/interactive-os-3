import { useMemo } from 'react'
import { useRouter, useRouterState } from '@tanstack/react-router'
import { Listbox, useControlState, navigateOnActivate, type Event, type NormalizedData } from '../../ds'
import { activePage, navItems, PAGE_PATHS, type PageId } from './data'

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const page = activePage(pathname)
  return (
    <nav aria-roledescription="sidebar" aria-label="관리도구 네비게이션">
      <header>
        <strong>교육 포털</strong>
        <small>관리도구 Admin</small>
      </header>
      {(['메인', '콘텐츠', '설정'] as const).map((section) => (
        <SidebarSection key={section} section={section} page={page} />
      ))}
      <footer>
        <span aria-hidden="true">👤</span>
        <span>관리자</span>
        <small>Admin</small>
      </footer>
    </nav>
  )
}

function SidebarSection({
  section, page,
}: { section: '메인' | '콘텐츠' | '설정'; page: PageId }) {
  const router = useRouter()
  const items = navItems.filter((n) => n.section === section)
  const base = useMemo<NormalizedData>(() => {
    const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
      __root__: { id: '__root__', data: {} },
      __focus__: { id: '__focus__', data: { id: page } },
    }
    for (const it of items) {
      entities[it.id] = {
        id: it.id,
        data: { label: it.label, icon: it.icon, badge: it.badge, selected: it.id === page },
      }
    }
    return {
      entities,
      relationships: { __root__: items.map((i) => i.id) },
    }
  }, [page, items])

  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') {
        const target = PAGE_PATHS[ev.id as PageId]
        if (target) router.navigate({ to: target })
      }
    })

  return (
    <section aria-labelledby={`sb-${section}`}>
      <h3 id={`sb-${section}`}>{section}</h3>
      <Listbox data={data} onEvent={onEvent} aria-label={section} />
    </section>
  )
}

import { useRouterState } from '@tanstack/react-router'
import { activePage, PAGE_TITLES } from '../entities/data'

export function Topbar() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const active = activePage(path)
  const title = active ? PAGE_TITLES[active].title : 'EDU Admin'
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <h1 className="text-base font-semibold text-neutral-900">{title}</h1>
    </div>
  )
}

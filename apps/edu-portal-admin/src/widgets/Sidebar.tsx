import { Link, useRouterState } from '@tanstack/react-router'
import { PAGE_PATHS } from '../entities/data'

const NAV: { label: string; to: string }[] = [
  { label: '대시보드',      to: PAGE_PATHS['dashboard'] },
  { label: '영상 관리',     to: PAGE_PATHS['video-list'] },
  { label: '코스 카테고리', to: PAGE_PATHS['cert-category'] },
  { label: '역할 카테고리', to: PAGE_PATHS['role-category'] },
  { label: '영상 순서',     to: PAGE_PATHS['video-order'] },
]

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  return (
    <nav aria-label="관리자 메뉴" className="flex flex-col gap-1 p-3">
      <h2 className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">EDU Admin</h2>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {NAV.map((n) => {
          const active = path === n.to || path.startsWith(n.to + '/')
          return (
            <li key={n.to}>
              <Link
                to={n.to}
                className={
                  'block rounded px-3 py-1.5 text-sm ' +
                  (active
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100')
                }
              >
                {n.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { SidebarNav } from './SidebarNav'

afterEach(cleanup)

const buildRouter = (initialPath: string) => {
  const root = createRootRoute({ component: () => (<><SidebarNav /><Outlet /></>) })
  const make = (path: string, label: string) =>
    createRoute({
      getParentRoute: () => root,
      path,
      component: () => <div>{label}</div>,
      staticData: { palette: { label, to: path, category: 'Test' } },
    })
  const data = make('/data', 'Data')
  const axes = make('/axes', 'Axes')
  const tree = root.addChildren([data, axes])
  return createRouter({
    routeTree: tree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })
}

const renderAt = async (path: string) => {
  const router = buildRouter(path)
  const r = render(<RouterProvider router={router as never} />)
  await router.load()
  r.rerender(<RouterProvider router={router as never} />)
  return router
}

describe('SidebarNav — selected/hover Tailwind 게이트 selector ↔ DOM 마커 일치', () => {
  it('active Link 는 aria-current=page 를 가진다 (TanStack de facto)', async () => {
    await renderAt('/data')
    const link = screen.getByRole('link', { name: 'Data' })
    expect(link.getAttribute('aria-current')).toBe('page')
  })

  it('비활성 Link 는 aria-current 가 없다', async () => {
    await renderAt('/data')
    const other = screen.getByRole('link', { name: 'Axes' })
    expect(other.getAttribute('aria-current')).not.toBe('page')
  })

  it('className 의 게이트 selector 가 active link 의 실제 마커를 잡는다 (cascade invariant)', async () => {
    await renderAt('/data')
    const link = screen.getByRole('link', { name: 'Data' })
    const className = link.className
    // [&:not(...)]:hover:bg-* 게이트가 있다면, 그 selector 가 active link 에 매칭되어야 한다.
    // 매칭이 안 되면 hover bg 가 selected 색을 덮어써서 white text + light bg 버그 발생.
    const m = className.match(/\[&:not\(([^)]+)\)\]:hover:/)
    if (m) {
      const sel = m[1]                              // 예: "[aria-current=page]"
      expect(link.matches(sel)).toBe(true)          // active link 가 그 selector 에 매칭되어야 게이트가 작동
    }
  })
})

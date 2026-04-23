import {
  createRootRoute, createRoute, createRouter, Outlet, redirect,
} from '@tanstack/react-router'
import { Finder } from './finder/Finder'
import { CommandPalette } from './controls/ui/overlay/CommandPalette'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <CommandPalette />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/finder/$', params: { _splat: '' } }) },
})

const finderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finder/$',
  component: Finder,
  staticData: {
    palette: { label: 'Finder', to: '/finder/$', params: { _splat: '' } },
  },
})

const routeTree = rootRoute.addChildren([indexRoute, finderRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
  interface StaticDataRouteOption {
    palette?: {
      label: string
      to: string
      params?: Record<string, string>
    }
  }
}

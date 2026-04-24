import {
  createRootRoute, createRoute, createRouter, Outlet, redirect,
} from '@tanstack/react-router'
import { Finder } from './meta/finder/Finder'
import { Inspector } from './meta/inspector/Inspector'
import { Matrix } from './meta/matrix/Matrix'
import { CommandPalette } from './ds/ui/overlay/CommandPalette'

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

const inspectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inspector',
  component: Inspector,
  staticData: {
    palette: { label: 'Inspector', to: '/inspector' },
  },
})

const matrixRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ds-matrix',
  component: Matrix,
  staticData: {
    palette: { label: 'DS Matrix', to: '/ds-matrix' },
  },
})

const routeTree = rootRoute.addChildren([indexRoute, finderRoute, inspectorRoute, matrixRoute])

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

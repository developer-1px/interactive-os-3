import {
  createRootRoute, createRoute, createRouter, Outlet, redirect,
} from '@tanstack/react-router'
import { Finder } from './finder/Finder'

const rootRoute = createRootRoute({ component: () => <Outlet /> })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/finder/$', params: { _splat: '' } }) },
})

const finderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finder/$',
  component: Finder,
})

const routeTree = rootRoute.addChildren([indexRoute, finderRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

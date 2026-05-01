import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
})

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
  interface StaticDataRouteOption {
    palette?: {
      label: string
      to: string
      params?: Record<string, string>
      category?: string
    }
  }
}

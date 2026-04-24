import {
  createRootRoute, createRoute, createRouter, Outlet, redirect,
} from '@tanstack/react-router'
import { Finder } from './meta/finder/Finder'
import { Inspector } from './meta/inspector/Inspector'
import { Matrix } from './meta/matrix/Matrix'
import { Atlas } from './meta/atlas/Atlas'
import { EduPortalAdmin } from './meta/edu-portal-admin/EduPortalAdmin'
import { Dashboard } from './meta/edu-portal-admin/pages/Dashboard'
import { VideoList } from './meta/edu-portal-admin/pages/VideoList'
import { VideoEdit } from './meta/edu-portal-admin/pages/VideoEdit'
import { RoleCategory } from './meta/edu-portal-admin/pages/RoleCategory'
import { CourseCategory } from './meta/edu-portal-admin/pages/CourseCategory'
import { VideoOrder } from './meta/edu-portal-admin/pages/VideoOrder'
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

const atlasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/atlas',
  component: Atlas,
  staticData: {
    palette: { label: 'Atlas', to: '/atlas' },
  },
})

const eduRoot = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edu-portal-admin',
  component: EduPortalAdmin,
})

const eduIndex = createRoute({
  getParentRoute: () => eduRoot,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/edu-portal-admin/dashboard' }) },
})

const eduDashboard = createRoute({
  getParentRoute: () => eduRoot,
  path: '/dashboard',
  component: Dashboard,
  staticData: {
    palette: { label: 'EDU · 대시보드', to: '/edu-portal-admin/dashboard' },
  },
})

const eduVideos = createRoute({
  getParentRoute: () => eduRoot,
  path: '/videos',
  component: VideoList,
  staticData: {
    palette: { label: 'EDU · 영상 관리', to: '/edu-portal-admin/videos' },
  },
})

const eduVideoNew = createRoute({
  getParentRoute: () => eduRoot,
  path: '/videos/new',
  component: VideoEdit,
  staticData: {
    palette: { label: 'EDU · 영상 등록', to: '/edu-portal-admin/videos/new' },
  },
})

const eduVideoEdit = createRoute({
  getParentRoute: () => eduRoot,
  path: '/videos/$id/edit',
  component: VideoEdit,
})

const eduRoleCategories = createRoute({
  getParentRoute: () => eduRoot,
  path: '/role-categories',
  component: RoleCategory,
  staticData: {
    palette: { label: 'EDU · 역할 카테고리', to: '/edu-portal-admin/role-categories' },
  },
})

const eduCourseCategories = createRoute({
  getParentRoute: () => eduRoot,
  path: '/course-categories',
  component: CourseCategory,
  staticData: {
    palette: { label: 'EDU · 코스 카테고리', to: '/edu-portal-admin/course-categories' },
  },
})

const eduVideoOrder = createRoute({
  getParentRoute: () => eduRoot,
  path: '/video-order',
  component: VideoOrder,
  staticData: {
    palette: { label: 'EDU · 영상 순서 관리', to: '/edu-portal-admin/video-order' },
  },
})

const eduPortalAdminRoute = eduRoot.addChildren([
  eduIndex,
  eduDashboard,
  eduVideos,
  eduVideoNew,
  eduVideoEdit,
  eduRoleCategories,
  eduCourseCategories,
  eduVideoOrder,
])

const routeTree = rootRoute.addChildren([indexRoute, finderRoute, inspectorRoute, matrixRoute, atlasRoute, eduPortalAdminRoute])

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

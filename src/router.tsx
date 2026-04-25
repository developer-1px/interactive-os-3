import {
  createRootRoute, createRoute, createRouter, Outlet, redirect,
} from '@tanstack/react-router'
import { Finder } from './routes/finder/Finder'
import { Inspector } from './routes/inspector/Inspector'
import { Matrix } from './routes/matrix/Matrix'
import { Atlas } from './routes/atlas/Atlas'
import { Catalog } from './routes/catalog/Catalog'
import { EduPortalAdmin } from './routes/edu-portal-admin/EduPortalAdmin'
import { Dashboard } from './routes/edu-portal-admin/pages/Dashboard'
import { VideoList } from './routes/edu-portal-admin/pages/VideoList'
import { VideoEdit } from './routes/edu-portal-admin/pages/VideoEdit'
import { RoleCategory } from './routes/edu-portal-admin/pages/RoleCategory'
import { CourseCategory } from './routes/edu-portal-admin/pages/CourseCategory'
import { VideoOrder } from './routes/edu-portal-admin/pages/VideoOrder'
import { CommandPalette } from './ds/ui/overlay/CommandPalette'
import { FloatingNav } from './ds/ui/overlay/FloatingNav'
import { GenresHub } from './routes/genres/GenresHub'
import { Inbox } from './routes/genres/inbox/Inbox'
import { Chat } from './routes/genres/chat/Chat'
import { Shop } from './routes/genres/shop/Shop'
import { Crm } from './routes/genres/crm/Crm'
import { Editor as GenreEditor } from './routes/genres/editor/Editor'
import { Feed } from './routes/genres/feed/Feed'
import { Analytics } from './routes/genres/analytics/Analytics'
import { Settings } from './routes/genres/settings/Settings'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <CommandPalette />
      <FloatingNav />
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

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  component: Catalog,
  staticData: {
    palette: { label: 'Catalog', to: '/catalog' },
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

const genresHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/genres',
  component: GenresHub,
  staticData: { palette: { label: 'Genres · Hub', to: '/genres' } },
})

const mkGenreRoute = (path: string, component: () => React.ReactNode, label: string) => createRoute({
  getParentRoute: () => rootRoute,
  path,
  component,
  staticData: { palette: { label, to: path } },
})

const genresInboxRoute     = mkGenreRoute('/genres/inbox',     Inbox,        'Genres · Inbox')
const genresChatRoute      = mkGenreRoute('/genres/chat',      Chat,         'Genres · Chat')
const genresShopRoute      = mkGenreRoute('/genres/shop',      Shop,         'Genres · Shop')
const genresCrmRoute       = mkGenreRoute('/genres/crm',       Crm,          'Genres · CRM')
const genresEditorRoute    = mkGenreRoute('/genres/editor',    GenreEditor,  'Genres · Editor')
const genresFeedRoute      = mkGenreRoute('/genres/feed',      Feed,         'Genres · Feed')
const genresAnalyticsRoute = mkGenreRoute('/genres/analytics', Analytics,    'Genres · Analytics')
const genresSettingsRoute  = mkGenreRoute('/genres/settings',  Settings,     'Genres · Settings')

const routeTree = rootRoute.addChildren([
  indexRoute, finderRoute, inspectorRoute, matrixRoute, atlasRoute, catalogRoute, eduPortalAdminRoute,
  genresHubRoute,
  genresInboxRoute, genresChatRoute, genresShopRoute, genresCrmRoute,
  genresEditorRoute, genresFeedRoute, genresAnalyticsRoute, genresSettingsRoute,
])

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
})

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

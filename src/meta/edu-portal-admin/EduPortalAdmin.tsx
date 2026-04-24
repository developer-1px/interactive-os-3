import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

/**
 * Shell wrapper. The outer `<main>/<section>` structure is matched by
 * existing `css/shell/panes.ts` selectors via `aria-roledescription`, so
 * it stays JSX for now — page-level FlatLayout runs inside <Outlet />.
 * Sidebar and Topbar are thin adapters kept as JSX shells too; only the
 * route page bodies are rewritten to `definePage + Renderer`.
 */
export function EduPortalAdmin() {
  return (
    <main aria-roledescription="edu-portal-admin-app" aria-label="교육 포털 관리도구">
      <section aria-roledescription="body">
        <Sidebar />
        <section aria-roledescription="workspace">
          <Topbar />
          <section aria-roledescription="content">
            <Outlet />
          </section>
        </section>
      </section>
    </main>
  )
}

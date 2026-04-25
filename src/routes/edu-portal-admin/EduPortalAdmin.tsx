import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { useShellMode } from '../../ds'
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
  const isMobile = useShellMode() === 'mobile'
  const [navOpen, setNavOpen] = useState(false)
  return (
    <main
      aria-roledescription="edu-portal-admin-app"
      aria-label="교육 포털 관리도구"
      data-nav-open={isMobile && navOpen ? 'true' : undefined}
      onClickCapture={(e) => {
        if (!isMobile || !navOpen) return
        const t = e.target as HTMLElement
        if (t.closest('nav[aria-roledescription="sidebar"] [role="option"]')) setNavOpen(false)
      }}
    >
      <section aria-roledescription="body">
        <Sidebar />
        {isMobile && navOpen && (
          <button
            type="button"
            aria-roledescription="scrim"
            aria-label="메뉴 닫기"
            onClick={() => setNavOpen(false)}
          />
        )}
        <section aria-roledescription="workspace">
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={navOpen}
            aria-roledescription="nav-toggle"
            data-icon="menu"
            onClick={() => setNavOpen((v) => !v)}
          />
          <Topbar />
          <section aria-roledescription="content">
            <Outlet />
          </section>
        </section>
      </section>
    </main>
  )
}

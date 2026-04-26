import { useState } from 'react'
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
  // mobile drawer는 CSS가 분기. JS는 navOpen 토글만 — 옵션 클릭 시 닫고 싶으면 closeOnNav.
  const [navOpen, setNavOpen] = useState(false)
  return (
    <main
      aria-roledescription="edu-portal-admin-app"
      aria-label="교육 포털 관리도구"
      data-nav-open={navOpen ? 'true' : undefined}
      onClickCapture={(e) => {
        if (!navOpen) return
        const t = e.target as HTMLElement
        if (t.closest('nav[aria-roledescription="sidebar"] [role="treeitem"]')) setNavOpen(false)
      }}
    >
      <section aria-roledescription="body">
        <Sidebar />
        {navOpen && (
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

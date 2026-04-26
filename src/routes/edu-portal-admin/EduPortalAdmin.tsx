import { useMemo, useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

/**
 * /edu-portal-admin shell.
 *
 * FlatLayout 셸 — Main entity 1개 + AdminShell Ui leaf. shell 내부의 navOpen 토글·
 * scrim·sidebar·topbar·Outlet 은 G5 원칙대로 단일 Ui leaf 안에 묶여 있다.
 */
export function EduPortalAdmin() {
  const page: NormalizedData = useMemo(() => definePage({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      shell: { id: 'shell', data: { type: 'Ui', component: 'AdminShell' } },
    },
    relationships: { [ROOT]: ['shell'] },
  }), [])
  return <Renderer page={page} localRegistry={{ AdminShell }} />
}

function AdminShell() {
  const [navOpen, setNavOpen] = useState(false)
  return (
    <main
      data-part="edu-portal-admin-app"
      aria-label="교육 포털 관리도구"
      data-nav-open={navOpen ? 'true' : undefined}
      onClickCapture={(e) => {
        if (!navOpen) return
        const t = e.target as HTMLElement
        if (t.closest('nav[data-part="sidebar"] [role="treeitem"]')) setNavOpen(false)
      }}
    >
      <section data-part="body">
        <Sidebar />
        {navOpen && (
          <button
            type="button"
            data-part="scrim"
            aria-label="메뉴 닫기"
            onClick={() => setNavOpen(false)}
          />
        )}
        <section data-part="workspace">
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={navOpen}
            data-part="nav-toggle"
            data-icon="menu"
            onClick={() => setNavOpen((v) => !v)}
          />
          <Topbar />
          <section data-part="content">
            <Outlet />
          </section>
        </section>
      </section>
    </main>
  )
}

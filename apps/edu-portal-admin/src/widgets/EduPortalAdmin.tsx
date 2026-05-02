import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

/** edu-portal-admin shell — sidebar + topbar + content. pure-headless+Tailwind. */
export function EduPortalAdmin() {
  return (
    <div className="grid h-svh grid-cols-[14rem_1fr] grid-rows-[auto_1fr] bg-neutral-50">
      <aside className="row-span-2 overflow-y-auto border-r border-neutral-200 bg-white">
        <Sidebar />
      </aside>
      <header className="border-b border-neutral-200 bg-white">
        <Topbar />
      </header>
      <main className="overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}

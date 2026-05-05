import { createRootRoute, Outlet } from '@tanstack/react-router'
import { SidebarNav } from '../nav/SidebarNav'

export const Route = createRootRoute({
  component: () => (
    <div className="flex w-screen flex-col md:h-screen md:flex-row md:overflow-hidden">
      <SidebarNav />
      <div className="flex-1 md:overflow-auto">
        <Outlet />
      </div>
    </div>
  ),
})

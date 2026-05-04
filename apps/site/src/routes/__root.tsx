import { createRootRoute, Outlet } from '@tanstack/react-router'
import { SidebarNav } from '../nav/SidebarNav'

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  ),
})

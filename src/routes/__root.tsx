import { createRootRoute, Outlet } from '@tanstack/react-router'
import { CommandPalette } from '../ds/ui/6-overlay/command/CommandPalette'
import { SidebarAdminFloating } from '../ds'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <CommandPalette />
      <SidebarAdminFloating />
    </>
  ),
})

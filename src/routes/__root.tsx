import { createRootRoute, Outlet } from '@tanstack/react-router'
import { CommandPalette } from '../ds/ui/6-overlay/palette/CommandPalette'
import { FloatingNav } from '../ds/ui/6-overlay/FloatingNav'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <CommandPalette />
      <FloatingNav />
    </>
  ),
})

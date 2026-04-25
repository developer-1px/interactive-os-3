import { createRootRoute, Outlet } from '@tanstack/react-router'
import { CommandPalette } from '../ds/ui/composite/palette/CommandPalette'
import { FloatingNav } from '../ds/ui/overlay/FloatingNav'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <CommandPalette />
      <FloatingNav />
    </>
  ),
})

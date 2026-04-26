import { createRootRoute, Outlet } from '@tanstack/react-router'
import { CommandPalette } from '@p/ds/ui/6-overlay/command/CommandPalette'
import { FloatingNav } from '@p/ds/ui/6-overlay/FloatingNav'
import { MobileFrame } from '@p/ds/ui/6-overlay/MobileFrame'

export const Route = createRootRoute({
  component: () => (
    <>
      <MobileFrame>
        <Outlet />
      </MobileFrame>
      <CommandPalette />
      <FloatingNav />
    </>
  ),
})

import { createRootRoute, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

// 첫 paint 에 필요 없는 overlay 와 mobile-only frame 은 lazy.
const MobileFrame = lazy(() =>
  import('@p/ds/devices/MobileFrame').then((m) => ({ default: m.MobileFrame })),
)
const CommandPalette = lazy(() =>
  import('@p/ds/shells/command/CommandPalette').then((m) => ({ default: m.CommandPalette })),
)
const FloatingNav = lazy(() =>
  import('@p/ds/ui/4-window/FloatingNav').then((m) => ({ default: m.FloatingNav })),
)

export const Route = createRootRoute({
  component: () => (
    <>
      <Suspense fallback={<Outlet />}>
        <MobileFrame>
          <Outlet />
        </MobileFrame>
      </Suspense>
      <Suspense fallback={null}>
        <CommandPalette />
        <FloatingNav />
      </Suspense>
    </>
  ),
})

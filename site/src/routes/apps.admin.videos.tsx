import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/admin/videos')({
  component: Outlet,
})

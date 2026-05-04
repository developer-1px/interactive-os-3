import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@apps/edu-portal-admin'

export const Route = createFileRoute('/apps/admin/dashboard')({
  component: Dashboard,
  staticData: { palette: { label: 'Admin · 대시보드', to: '/apps/admin/dashboard' } },
})

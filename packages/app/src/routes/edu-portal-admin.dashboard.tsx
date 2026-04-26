import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@apps/edu-portal-admin/pages/Dashboard'

export const Route = createFileRoute('/edu-portal-admin/dashboard')({
  component: Dashboard,
  staticData: { palette: { label: 'EDU · 대시보드', to: '/edu-portal-admin/dashboard' } },
})

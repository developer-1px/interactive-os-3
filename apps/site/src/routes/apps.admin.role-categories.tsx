import { createFileRoute } from '@tanstack/react-router'
import { RoleCategory } from '@apps/edu-portal-admin'

export const Route = createFileRoute('/apps/admin/role-categories')({
  component: RoleCategory,
  staticData: { palette: { label: 'Admin · 역할 카테고리', to: '/apps/admin/role-categories' } },
})

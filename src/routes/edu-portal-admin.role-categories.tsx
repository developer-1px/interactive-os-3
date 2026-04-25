import { createFileRoute } from '@tanstack/react-router'
import { RoleCategory } from './edu-portal-admin/pages/RoleCategory'

export const Route = createFileRoute('/edu-portal-admin/role-categories')({
  component: RoleCategory,
  staticData: { palette: { label: 'EDU · 역할 카테고리', to: '/edu-portal-admin/role-categories' } },
})

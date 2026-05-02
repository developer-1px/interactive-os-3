import { createFileRoute } from '@tanstack/react-router'
import { CourseCategory } from '@apps/edu-portal-admin'

export const Route = createFileRoute('/apps/admin/course-categories')({
  component: CourseCategory,
  staticData: { palette: { label: 'Admin · 코스 카테고리', to: '/apps/admin/course-categories' } },
})

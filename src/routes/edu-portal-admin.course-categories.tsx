import { createFileRoute } from '@tanstack/react-router'
import { CourseCategory } from './edu-portal-admin/pages/CourseCategory'

export const Route = createFileRoute('/edu-portal-admin/course-categories')({
  component: CourseCategory,
  staticData: { palette: { label: 'EDU · 코스 카테고리', to: '/edu-portal-admin/course-categories' } },
})

import { createFileRoute } from '@tanstack/react-router'
import { EduPortalAdmin } from '@apps/edu-portal-admin'

export const Route = createFileRoute('/apps/admin')({
  component: EduPortalAdmin,
  staticData: {
    palette: {
      label: 'Admin',
      to: '/apps/admin',
      sub: 'Course/role categories, video CRUD, ordering',
    },
  },
})

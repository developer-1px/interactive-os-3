import { createFileRoute } from '@tanstack/react-router'
import { EduPortalAdmin } from './edu-portal-admin/EduPortalAdmin'

export const Route = createFileRoute('/edu-portal-admin')({
  component: EduPortalAdmin,
})

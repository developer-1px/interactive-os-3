import { createFileRoute } from '@tanstack/react-router'
import { EduPortalAdmin } from '@apps/edu-portal-admin'

export const Route = createFileRoute('/apps/admin')({
  component: EduPortalAdmin,
})

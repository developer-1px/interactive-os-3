import { createFileRoute } from '@tanstack/react-router'
import { EduPortalAdmin } from '@apps/edu-portal-admin'

export const Route = createFileRoute('/edu-portal-admin')({
  component: EduPortalAdmin,
})

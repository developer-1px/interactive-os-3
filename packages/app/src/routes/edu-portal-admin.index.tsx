import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/edu-portal-admin/')({
  beforeLoad: () => { throw redirect({ to: '/edu-portal-admin/dashboard' }) },
})

import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/admin/')({
  beforeLoad: () => { throw redirect({ to: '/apps/admin/dashboard' }) },
})

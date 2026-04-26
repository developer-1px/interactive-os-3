import { createFileRoute } from '@tanstack/react-router'
import { Crm } from '@apps/genres/crm/Crm'

export const Route = createFileRoute('/genres/crm')({
  component: Crm,
  staticData: { palette: { label: 'Genres · CRM', to: '/genres/crm' } },
})

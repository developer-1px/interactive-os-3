import { createFileRoute } from '@tanstack/react-router'
import { Analytics } from './genres/analytics/Analytics'

export const Route = createFileRoute('/genres/analytics')({
  component: Analytics,
  staticData: { palette: { label: 'Genres · Analytics', to: '/genres/analytics' } },
})

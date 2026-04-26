import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@apps/genres/settings/Settings'

export const Route = createFileRoute('/genres/settings')({
  component: Settings,
  staticData: { palette: { label: 'Genres · Settings', to: '/genres/settings' } },
})

import { createFileRoute } from '@tanstack/react-router'
import { Feed } from '@apps/genres/feed/Feed'

export const Route = createFileRoute('/genres/feed')({
  component: Feed,
  staticData: { palette: { label: 'Genres · Feed', to: '/genres/feed' } },
})

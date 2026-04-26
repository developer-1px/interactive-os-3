import { createFileRoute } from '@tanstack/react-router'
import { Feed } from './genres/feed/Feed'

export const Route = createFileRoute('/genres/feed')({
  component: Feed,
  staticData: { palette: { label: 'Genres · Feed', to: '/genres/feed' } },
})

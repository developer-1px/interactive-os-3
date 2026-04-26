import { createFileRoute } from '@tanstack/react-router'
import { Inbox } from './genres/inbox/Inbox'

export const Route = createFileRoute('/genres/inbox')({
  component: Inbox,
  staticData: { palette: { label: 'Genres · Inbox', to: '/genres/inbox' } },
})

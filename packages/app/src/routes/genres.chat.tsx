import { createFileRoute } from '@tanstack/react-router'
import { Chat } from './genres/chat/Chat'

export const Route = createFileRoute('/genres/chat')({
  component: Chat,
  staticData: { palette: { label: 'Genres · Chat (DM)', to: '/genres/chat' } },
})

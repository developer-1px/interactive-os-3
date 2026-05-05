import { createFileRoute } from '@tanstack/react-router'
import { Kanban } from '@apps/kanban'

export const Route = createFileRoute('/apps/kanban/$')({
  component: Kanban,
  staticData: {
    palette: {
      label: 'Kanban',
      to: '/apps/kanban/$',
      sub: 'Trello-lite — keyboard-only cross-column move via cut+paste',
    },
  },
})

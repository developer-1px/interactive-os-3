import { createFileRoute } from '@tanstack/react-router'
import { Board } from '@apps/genres/board/Board'

export const Route = createFileRoute('/genres/board')({
  component: Board,
  staticData: { palette: { label: 'Genres · Board', to: '/genres/board' } },
})

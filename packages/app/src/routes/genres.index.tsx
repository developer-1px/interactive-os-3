import { createFileRoute } from '@tanstack/react-router'
import { GenresHub } from '@apps/genres'

export const Route = createFileRoute('/genres/')({
  component: GenresHub,
  staticData: { palette: { label: 'Genres · Hub', to: '/genres' } },
})

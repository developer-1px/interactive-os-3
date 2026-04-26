import { createFileRoute } from '@tanstack/react-router'
import { GenresHub } from './genres/GenresHub'

export const Route = createFileRoute('/genres/')({
  component: GenresHub,
  staticData: { palette: { label: 'Genres · Hub', to: '/genres' } },
})

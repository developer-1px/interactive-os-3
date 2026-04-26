import { createFileRoute } from '@tanstack/react-router'
import { Content } from '@apps/content'

export const Route = createFileRoute('/content')({
  component: Content,
  staticData: { palette: { label: 'Content', to: '/content' } },
})

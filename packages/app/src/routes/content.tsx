import { createFileRoute } from '@tanstack/react-router'
import { Content } from '@showcase/content'

export const Route = createFileRoute('/content')({
  component: Content,
  staticData: { palette: { label: 'Content', to: '/content', category: 'design-system' } },
})

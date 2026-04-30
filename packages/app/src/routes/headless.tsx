import { createFileRoute } from '@tanstack/react-router'
import { Headless } from '@showcase/headless'

export const Route = createFileRoute('/headless')({
  component: Headless,
  staticData: { palette: { label: 'Headless API', to: '/headless', category: 'design-system' } },
})

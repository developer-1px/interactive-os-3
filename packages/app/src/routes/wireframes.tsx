import { createFileRoute } from '@tanstack/react-router'
import { Wireframes } from '@showcase/playground/wireframes'

export const Route = createFileRoute('/wireframes')({
  component: Wireframes,
  staticData: { palette: { label: 'Wireframes', to: '/wireframes' } },
})

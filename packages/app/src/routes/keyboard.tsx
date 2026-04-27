import { createFileRoute } from '@tanstack/react-router'
import { Keyboard } from '@showcase/keyboard'

export const Route = createFileRoute('/keyboard')({
  component: Keyboard,
  staticData: { palette: { label: 'Keyboard Test', to: '/keyboard', category: 'design-system' } },
})

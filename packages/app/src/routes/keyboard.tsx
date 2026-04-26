import { createFileRoute } from '@tanstack/react-router'
import { Keyboard } from '@apps/keyboard'

export const Route = createFileRoute('/keyboard')({
  component: Keyboard,
  staticData: { palette: { label: 'Keyboard Test', to: '/keyboard' } },
})

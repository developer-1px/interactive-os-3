import { createFileRoute } from '@tanstack/react-router'
import { Inventory } from '@showcase/playground/inventory'

export const Route = createFileRoute('/inventory')({
  component: Inventory,
  staticData: { palette: { label: 'Inventory — ds 전수 카탈로그', to: '/inventory' } },
})

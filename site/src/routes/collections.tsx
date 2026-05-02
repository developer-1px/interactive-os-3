import { createFileRoute } from '@tanstack/react-router'
import { CollectionApp } from '../collection-site/App'

export const Route = createFileRoute('/collections')({
  component: CollectionApp,
  staticData: { palette: { label: 'Collections', to: '/collections' } },
})

import { createFileRoute } from '@tanstack/react-router'
import { Catalog } from './catalog/Catalog'

export const Route = createFileRoute('/catalog')({
  component: Catalog,
  staticData: { palette: { label: 'Catalog', to: '/catalog' } },
})

import { createFileRoute } from '@tanstack/react-router'
import { Shop } from '@apps/genres/shop/Shop'

export const Route = createFileRoute('/genres/shop')({
  component: Shop,
  staticData: { palette: { label: 'Genres · Shop', to: '/genres/shop' } },
})

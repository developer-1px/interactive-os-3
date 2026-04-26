import { createFileRoute } from '@tanstack/react-router'
import { ThemeCreator } from '@apps/theme'

export const Route = createFileRoute('/theme')({
  component: ThemeCreator,
  staticData: { palette: { label: 'Theme Creator', to: '/theme' } },
})

import { createFileRoute } from '@tanstack/react-router'
import { Inspector } from './inspector/Inspector'

export const Route = createFileRoute('/inspector')({
  component: Inspector,
  staticData: { palette: { label: 'Inspector', to: '/inspector' } },
})

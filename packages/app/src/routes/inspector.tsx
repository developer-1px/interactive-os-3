import { createFileRoute } from '@tanstack/react-router'
import { Inspector } from '@showcase/inspector'

export const Route = createFileRoute('/inspector')({
  component: Inspector,
  staticData: { palette: { label: 'Inspector', to: '/inspector', category: 'design-system' } },
})

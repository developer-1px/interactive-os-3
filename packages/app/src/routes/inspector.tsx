import { createFileRoute } from '@tanstack/react-router'
import { Inspector } from '@apps/inspector'

export const Route = createFileRoute('/inspector')({
  component: Inspector,
  staticData: { palette: { label: 'Inspector', to: '/inspector' } },
})

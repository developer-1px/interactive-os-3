import { createFileRoute } from '@tanstack/react-router'
import { Foundations } from '@apps/foundations'

export const Route = createFileRoute('/foundations')({
  component: Foundations,
  staticData: { palette: { label: 'Foundations', to: '/foundations' } },
})

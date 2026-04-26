import { createFileRoute } from '@tanstack/react-router'
import { Foundations } from './foundations/Foundations'

export const Route = createFileRoute('/foundations')({
  component: Foundations,
  staticData: { palette: { label: 'Foundations', to: '/foundations' } },
})

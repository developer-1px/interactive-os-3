import { createFileRoute } from '@tanstack/react-router'
import { Atlas } from './atlas/Atlas'

export const Route = createFileRoute('/atlas')({
  component: Atlas,
  staticData: { palette: { label: 'Atlas', to: '/atlas' } },
})

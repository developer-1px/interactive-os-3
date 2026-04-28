import { createFileRoute } from '@tanstack/react-router'
import { Foundations } from '@showcase/playground/foundations'

export const Route = createFileRoute('/foundations')({
  component: Foundations,
  staticData: { palette: { label: 'Foundation 카탈로그', to: '/foundations' } },
})

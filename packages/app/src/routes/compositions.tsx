import { createFileRoute } from '@tanstack/react-router'
import { Compositions } from '@showcase/playground/compositions'

export const Route = createFileRoute('/compositions')({
  component: Compositions,
  staticData: { palette: { label: '복합 조립 갤러리', to: '/compositions' } },
})

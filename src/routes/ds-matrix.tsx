import { createFileRoute } from '@tanstack/react-router'
import { Matrix } from './matrix/Matrix'

export const Route = createFileRoute('/ds-matrix')({
  component: Matrix,
  staticData: { palette: { label: 'DS Matrix', to: '/ds-matrix' } },
})

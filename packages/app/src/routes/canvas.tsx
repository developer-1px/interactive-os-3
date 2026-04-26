import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@showcase/canvas'

export const Route = createFileRoute('/canvas')({
  component: Canvas,
  staticData: { palette: { label: 'Canvas', to: '/canvas' } },
})

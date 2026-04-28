import { createFileRoute } from '@tanstack/react-router'
import { BucketSection, LayerPage } from '@showcase/canvas'

export const Route = createFileRoute('/canvas/primitives')({
  component: () => (
    <LayerPage>
      <BucketSection bucket="L2" />
    </LayerPage>
  ),
  staticData: { palette: { label: 'Canvas · Primitives (L2)', to: '/canvas/primitives' } },
})

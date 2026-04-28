import { createFileRoute } from '@tanstack/react-router'
import { BucketSection, LayerPage } from '@showcase/canvas'

export const Route = createFileRoute('/canvas/patterns')({
  component: () => (
    <LayerPage>
      <BucketSection bucket="L3" />
    </LayerPage>
  ),
  staticData: { palette: { label: 'Canvas · Patterns (L3)', to: '/canvas/patterns' } },
})

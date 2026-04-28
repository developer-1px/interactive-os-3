import { createFileRoute } from '@tanstack/react-router'
import { BucketSection, LayerPage } from '@showcase/canvas'

export const Route = createFileRoute('/canvas/templates')({
  component: () => (
    <LayerPage>
      <BucketSection bucket="L4" />
    </LayerPage>
  ),
  staticData: { palette: { label: 'Canvas · Templates (L4)', to: '/canvas/templates' } },
})

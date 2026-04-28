import { createFileRoute } from '@tanstack/react-router'
import { BucketSection, LayerPage } from '@showcase/canvas'

export const Route = createFileRoute('/canvas/devices')({
  component: () => (
    <LayerPage>
      <BucketSection bucket="L5" />
    </LayerPage>
  ),
  staticData: { palette: { label: 'Canvas · Devices (L5)', to: '/canvas/devices' } },
})

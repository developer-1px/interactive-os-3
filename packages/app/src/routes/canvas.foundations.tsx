import { createFileRoute } from '@tanstack/react-router'
import { LayerPage, SemanticSection } from '@showcase/canvas'

export const Route = createFileRoute('/canvas/foundations')({
  component: () => (
    <LayerPage>
      <SemanticSection />
    </LayerPage>
  ),
  staticData: { palette: { label: 'Canvas · Foundations (L1)', to: '/canvas/foundations' } },
})

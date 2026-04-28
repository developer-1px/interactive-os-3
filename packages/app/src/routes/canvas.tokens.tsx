import { createFileRoute } from '@tanstack/react-router'
import { LayerPage, PaletteSection } from '@showcase/canvas'

export const Route = createFileRoute('/canvas/tokens')({
  component: () => (
    <LayerPage>
      <PaletteSection />
    </LayerPage>
  ),
  staticData: { palette: { label: 'Canvas · Tokens (L0)', to: '/canvas/tokens' } },
})

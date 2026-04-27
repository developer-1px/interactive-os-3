import { createFileRoute } from '@tanstack/react-router'
import { Slides } from '@apps/slides'

export const Route = createFileRoute('/slides/$')({
  component: Slides,
  staticData: { palette: { label: 'Slides (md PPT)', to: '/slides/$', params: { _splat: 'docs/slides-sample.md' } } },
})

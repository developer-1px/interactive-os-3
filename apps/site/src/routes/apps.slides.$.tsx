import { createFileRoute } from '@tanstack/react-router'
import { Slides } from '@apps/slides'

export const Route = createFileRoute('/apps/slides/$')({
  component: Slides,
  staticData: {
    palette: {
      label: 'Slides (md PPT)',
      to: '/apps/slides/$',
      params: { _splat: 'docs/slides-sample.md' },
      sub: 'Markdown deck — ←/→, PageDown, F, ESC',
    },
  },
})

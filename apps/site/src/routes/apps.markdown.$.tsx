import { createFileRoute } from '@tanstack/react-router'
import { Markdown } from '@apps/markdown'

export const Route = createFileRoute('/apps/markdown/$')({
  component: Markdown,
  staticData: {
    palette: {
      label: 'Markdown Viewer',
      to: '/apps/markdown/$',
      params: { _splat: 'README.md' },
      sub: 'Markdown viewer with file routing',
    },
  },
})

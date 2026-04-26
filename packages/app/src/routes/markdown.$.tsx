import { createFileRoute } from '@tanstack/react-router'
import { Markdown } from './markdown/Markdown'

export const Route = createFileRoute('/markdown/$')({
  component: Markdown,
  staticData: { palette: { label: 'Markdown Viewer', to: '/markdown/$', params: { _splat: 'README.md' } } },
})

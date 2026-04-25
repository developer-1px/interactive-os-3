import { createFileRoute } from '@tanstack/react-router'
import { Editor } from './genres/editor/Editor'

export const Route = createFileRoute('/genres/editor')({
  component: Editor,
  staticData: { palette: { label: 'Genres · Editor', to: '/genres/editor' } },
})

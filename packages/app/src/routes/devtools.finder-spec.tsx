import { createFileRoute } from '@tanstack/react-router'
import { FinderInspector } from '@apps/finder'

export const Route = createFileRoute('/devtools/finder-spec')({
  component: FinderInspector,
  staticData: { palette: { label: 'Devtools · Finder Spec', to: '/devtools/finder-spec' } },
})

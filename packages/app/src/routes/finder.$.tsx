import { createFileRoute } from '@tanstack/react-router'
import { Finder } from '@apps/finder'

export const Route = createFileRoute('/finder/$')({
  component: Finder,
  staticData: {
    palette: { label: 'Finder', to: '/finder/$', params: { _splat: '' } },
  },
})

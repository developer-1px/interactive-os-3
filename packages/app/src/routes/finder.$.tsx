import { createFileRoute } from '@tanstack/react-router'
import { Finder } from './finder/Finder'

export const Route = createFileRoute('/finder/$')({
  component: Finder,
  staticData: {
    palette: { label: 'Finder', to: '/finder/$', params: { _splat: '' } },
  },
})

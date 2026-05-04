import { createFileRoute } from '@tanstack/react-router'
import { Finder } from '@apps/finder'

export const Route = createFileRoute('/apps/finder/$')({
  component: Finder,
  staticData: {
    palette: {
      label: 'Finder',
      to: '/apps/finder/$',
      params: { _splat: '' },
      sub: 'Mac Finder column view — keyboard-first navigation',
    },
  },
})

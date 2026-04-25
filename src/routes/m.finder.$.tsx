import { createFileRoute } from '@tanstack/react-router'
import { FinderMobile } from './finder-mobile/FinderMobile'

export const Route = createFileRoute('/m/finder/$')({
  component: FinderMobile,
  staticData: {
    palette: { label: 'Finder (mobile)', to: '/m/finder/$', params: { _splat: '' } },
  },
})

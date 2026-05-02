import { createFileRoute } from '@tanstack/react-router'
import { WrapperApp } from '../wrapper-site/App'

export const Route = createFileRoute('/wrappers')({
  component: WrapperApp,
  staticData: { palette: { label: 'Wrappers', to: '/wrappers' } },
})

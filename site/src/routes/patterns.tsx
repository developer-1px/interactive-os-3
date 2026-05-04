import { createFileRoute } from '@tanstack/react-router'
import { App as HeadlessSite } from '../headless-site/App'

export const Route = createFileRoute('/patterns')({
  component: HeadlessSite,
  staticData: {
    palette: {
      label: 'Patterns',
      to: '/patterns',
      sub: 'APG recipes — listbox, treegrid, menu, dialog, slider …',
    },
  },
})

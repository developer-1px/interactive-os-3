import { createFileRoute } from '@tanstack/react-router'
import { App as HeadlessSite } from '../catalog/CatalogApp'

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

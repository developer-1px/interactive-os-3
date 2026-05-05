import { createFileRoute } from '@tanstack/react-router'
import { Outliner } from '@apps/outliner'

export const Route = createFileRoute('/apps/outliner/$')({
  component: Outliner,
  staticData: {
    palette: {
      label: 'Outliner',
      to: '/apps/outliner/$',
      sub: 'Keyboard-only Workflowy clone — zod-crud × @p/headless example',
    },
  },
})

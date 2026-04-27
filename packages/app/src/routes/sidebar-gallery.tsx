import { createFileRoute } from '@tanstack/react-router'
import { SidebarGallery } from '@showcase/playground/sidebar-gallery'

export const Route = createFileRoute('/sidebar-gallery')({
  component: SidebarGallery,
  staticData: { palette: { label: 'Sidebar Gallery', to: '/sidebar-gallery', category: 'design-system' } },
})

import { createFileRoute } from '@tanstack/react-router'
import { VideoEdit } from '@apps/edu-portal-admin'

export const Route = createFileRoute('/apps/admin/videos/new')({
  component: VideoEdit,
  staticData: { palette: { label: 'Admin · 영상 등록', to: '/apps/admin/videos/new' } },
})

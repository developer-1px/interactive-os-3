import { createFileRoute } from '@tanstack/react-router'
import { VideoOrder } from '@apps/edu-portal-admin'

export const Route = createFileRoute('/apps/admin/video-order')({
  component: VideoOrder,
  staticData: { palette: { label: 'Admin · 영상 순서 관리', to: '/apps/admin/video-order' } },
})

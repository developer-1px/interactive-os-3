import { createFileRoute } from '@tanstack/react-router'
import { VideoOrder } from '@apps/edu-portal-admin'

export const Route = createFileRoute('/edu-portal-admin/video-order')({
  component: VideoOrder,
  staticData: { palette: { label: 'EDU · 영상 순서 관리', to: '/edu-portal-admin/video-order' } },
})

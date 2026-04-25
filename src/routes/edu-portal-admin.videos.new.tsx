import { createFileRoute } from '@tanstack/react-router'
import { VideoEdit } from './edu-portal-admin/pages/VideoEdit'

export const Route = createFileRoute('/edu-portal-admin/videos/new')({
  component: VideoEdit,
  staticData: { palette: { label: 'EDU · 영상 등록', to: '/edu-portal-admin/videos/new' } },
})

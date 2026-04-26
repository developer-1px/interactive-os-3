import { createFileRoute } from '@tanstack/react-router'
import { VideoList } from './edu-portal-admin/pages/VideoList'

export const Route = createFileRoute('/edu-portal-admin/videos/')({
  component: VideoList,
  staticData: { palette: { label: 'EDU · 영상 관리', to: '/edu-portal-admin/videos' } },
})

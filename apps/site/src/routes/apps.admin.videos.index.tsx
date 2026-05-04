import { createFileRoute } from '@tanstack/react-router'
import { VideoList } from '@apps/edu-portal-admin'

export const Route = createFileRoute('/apps/admin/videos/')({
  component: VideoList,
  staticData: { palette: { label: 'Admin · 영상 관리', to: '/apps/admin/videos' } },
})

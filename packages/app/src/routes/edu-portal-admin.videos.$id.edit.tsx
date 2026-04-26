import { createFileRoute } from '@tanstack/react-router'
import { VideoEdit } from '@apps/edu-portal-admin/pages/VideoEdit'

export const Route = createFileRoute('/edu-portal-admin/videos/$id/edit')({
  component: VideoEdit,
})

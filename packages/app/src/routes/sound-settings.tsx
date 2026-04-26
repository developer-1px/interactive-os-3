import { createFileRoute } from '@tanstack/react-router'
import { SoundSettings } from '@showcase/playground/sound-settings'

export const Route = createFileRoute('/sound-settings')({
  component: SoundSettings,
  staticData: { palette: { label: 'macOS · 사운드 설정', to: '/sound-settings' } },
})

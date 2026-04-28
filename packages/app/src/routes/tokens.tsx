import { createFileRoute } from '@tanstack/react-router'
import { Tokens } from '@showcase/playground/tokens'

export const Route = createFileRoute('/tokens')({
  component: Tokens,
  staticData: { palette: { label: 'Design Token 카탈로그', to: '/tokens' } },
})

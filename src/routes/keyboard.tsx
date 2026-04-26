import { createFileRoute } from '@tanstack/react-router'
import { Keyboard } from './keyboard/Keyboard'

export const Route = createFileRoute('/keyboard')({
  component: Keyboard,
  staticData: { palette: { label: 'Keyboard Test', to: '/keyboard' } },
})

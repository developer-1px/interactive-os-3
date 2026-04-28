import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '@showcase/canvas'

/**
 * /canvas — 전체 audit board (zoom-pan overview).
 *   Essentials + 7 columns (L0~L5 + Component tokens) 한 장에.
 *   개별 layer 검증은 /canvas/{essentials, tokens, foundations, primitives, patterns, templates, devices}.
 */
export const Route = createFileRoute('/canvas/')({
  component: Canvas,
  staticData: { palette: { label: 'Canvas (overview)', to: '/canvas' } },
})

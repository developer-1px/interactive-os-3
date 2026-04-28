/**
 * CanvasTokensRadius — Atlas Border Radius frame.
 *
 * 출처: docs/inbox/screens-foundation.jsx RadiusScreen.
 * cell 렌더링은 <TokenPreview kind="radius"> — 정본 어휘 통과.
 */
import { radius } from '@p/ds/tokens/semantic'
import { TokenPreview } from './preview'

type R = { key: 'sm' | 'md' | 'lg' | 'pill'; call: string }

const RADII: R[] = [
  { key: 'sm',   call: "radius('sm')" },
  { key: 'md',   call: "radius('md')" },
  { key: 'lg',   call: "radius('lg')" },
  { key: 'pill', call: "radius('pill')" },
]

export function CanvasTokensRadius() {
  return (
    <div data-part="canvas-radius-frame">
      {RADII.map((r) => (
        <TokenPreview
          key={r.key}
          kind="radius"
          value={radius(r.key)}
          name={r.key}
          call={r.call}
        />
      ))}
    </div>
  )
}

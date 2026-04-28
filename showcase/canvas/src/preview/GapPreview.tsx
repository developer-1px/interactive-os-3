import type { PreviewProps } from './types'
import { Caption } from './Caption'

/** Gap — 두 box + gap between. */
export function GapPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="gap">
      <div data-stage style={{ display: 'flex', gap: value }}>
        <div data-box />
        <div data-box />
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

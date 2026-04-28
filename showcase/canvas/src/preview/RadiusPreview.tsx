import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function RadiusPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="radius">
      <div data-stage style={{ borderRadius: value }} />
      <Caption name={name} call={call} />
    </figure>
  )
}

import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function ColorPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="color">
      <div data-stage style={{ backgroundColor: value }} />
      <Caption name={name} call={call} />
    </figure>
  )
}

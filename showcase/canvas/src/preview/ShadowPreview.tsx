import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function ShadowPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="shadow">
      <div data-stage style={{ boxShadow: value }} />
      <Caption name={name} call={call} />
    </figure>
  )
}

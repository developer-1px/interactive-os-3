import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function DurationPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="duration">
      <div data-stage>
        <div data-dot style={{ animationDuration: value }} />
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

import type { PreviewProps } from './types'
import { Caption } from './Caption'

/** Length — bar visualizer. value 가 width 가 됨. */
export function LengthPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="length">
      <div data-stage>
        <div data-bar style={{ inlineSize: value }} />
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

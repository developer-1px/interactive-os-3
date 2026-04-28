import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function BorderStylePreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="borderStyle">
      <div data-stage>
        <div data-line style={{ borderTopWidth: 2, borderTopStyle: value as never }} />
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

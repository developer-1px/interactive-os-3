import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function BorderWidthPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="borderWidth">
      <div data-stage>
        <div data-line style={{ borderTopWidth: value, borderTopStyle: 'solid' }} />
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

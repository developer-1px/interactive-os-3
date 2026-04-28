import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function FontSizePreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="fontSize">
      <div data-stage style={{ fontSize: value, lineHeight: 1.05 }}>Aa 가나 1234</div>
      <Caption name={name} call={call} />
    </figure>
  )
}

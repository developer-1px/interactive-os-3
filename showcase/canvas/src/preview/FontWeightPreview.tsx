import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function FontWeightPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="fontWeight">
      <div data-stage style={{ fontWeight: value, fontSize: 28 }}>Bold Aa</div>
      <Caption name={name} call={call} />
    </figure>
  )
}

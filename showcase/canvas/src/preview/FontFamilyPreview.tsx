import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function FontFamilyPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="fontFamily">
      <div data-stage style={{ fontFamily: value, fontSize: 18 }}>The quick brown fox</div>
      <Caption name={name} call={call} />
    </figure>
  )
}

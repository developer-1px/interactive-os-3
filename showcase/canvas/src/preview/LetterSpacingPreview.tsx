import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function LetterSpacingPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="letterSpacing">
      <div data-stage style={{ letterSpacing: value, fontSize: 18, textTransform: 'uppercase' }}>TRACKING</div>
      <Caption name={name} call={call} />
    </figure>
  )
}

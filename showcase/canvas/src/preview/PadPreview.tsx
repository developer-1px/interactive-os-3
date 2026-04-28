import type { PreviewProps } from './types'
import { Caption } from './Caption'

/** Pad — outer box wraps inner. value = padding. */
export function PadPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="pad">
      <div data-stage>
        <div data-outer style={{ padding: value }}>
          <div data-inner />
        </div>
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

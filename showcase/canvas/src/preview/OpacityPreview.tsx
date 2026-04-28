import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function OpacityPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="opacity">
      <div data-stage>
        <div data-checker>
          <div data-overlay style={{ opacity: value }} />
        </div>
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

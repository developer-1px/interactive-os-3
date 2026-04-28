import type { PreviewProps } from './types'
import { Caption } from './Caption'

export function LineHeightPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="lineHeight">
      <div data-stage style={{ lineHeight: value, fontSize: 14, maxInlineSize: 220 }}>
        The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow.
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

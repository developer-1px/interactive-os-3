import type { PreviewProps } from './types'
import { Caption } from './Caption'

/** Outline — focus ring 시각. value 가 outline-width 일 수도 outline-offset 일 수도 있어 통합 시연. */
export function OutlinePreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="outline">
      <div data-stage>
        <div data-box style={{ outline: `${value} solid var(--ds-accent)`, outlineOffset: value }} />
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

import type { PreviewProps } from './types'
import { Caption } from './Caption'

/** Breakpoint — 가로 bar + value 위치 marker. */
export function BreakpointPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="breakpoint">
      <div data-stage>
        <div data-bar>
          <div data-marker />
          <span data-value>{value}</span>
        </div>
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

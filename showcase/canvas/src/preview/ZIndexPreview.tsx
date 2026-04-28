import type { PreviewProps } from './types'
import { Caption } from './Caption'

/** zIndex — value 자체를 mono text 로 (시각적으로 z 단계는 컨텍스트 없이 보이지 않음). */
export function ZIndexPreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="zIndex">
      <div data-stage>
        <code>{value}</code>
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

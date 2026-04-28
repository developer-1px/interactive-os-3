import type { PreviewProps } from './types'
import { Caption } from './Caption'

/** Recipe / Selector — raw value 가 아닌 CSS fragment. mono 텍스트로 노출. */
export function RecipePreview({ value, name, call }: PreviewProps) {
  return (
    <figure data-part="canvas-preview" data-kind="recipe">
      <div data-stage>
        <code>{value || '—'}</code>
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

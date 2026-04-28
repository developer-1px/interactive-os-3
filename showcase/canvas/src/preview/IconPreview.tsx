import type { PreviewProps } from './types'
import { Caption } from './Caption'

/**
 * Icon preview — value 는 "url(data:image/svg+xml;...)" mask URL 또는 raw `<svg>`.
 * data-icon 토큰 시스템과 호환 — value 가 var(--ds-icon-X) 면 mask 로 적용.
 */
export function IconPreview({ value, name, call }: PreviewProps) {
  const isVar = value.startsWith('var(')
  return (
    <figure data-part="canvas-preview" data-kind="icon">
      <div
        data-stage
        style={{
          inlineSize: 24,
          blockSize: 24,
          backgroundColor: 'currentColor',
          WebkitMaskImage: isVar ? value : undefined,
          maskImage: isVar ? value : undefined,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
      <Caption name={name} call={call} />
    </figure>
  )
}

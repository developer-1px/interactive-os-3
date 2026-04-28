import type { PreviewProps } from './types'
import { Caption } from './Caption'

/**
 * Easing — bezier curve 시각.
 * cubic-bezier(x1,y1,x2,y2) 파싱하여 SVG path 그림. linear 면 직선.
 */
function parseBezier(value: string): [number, number, number, number] | null {
  const m = value.match(/cubic-bezier\(([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\)/)
  if (!m) return null
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4])]
}

export function EasingPreview({ value, name, call }: PreviewProps) {
  const b = parseBezier(value)
  // 캔버스: 40x40 (y 반전 — 시작 좌하, 끝 우상). 0..1 → 0..40
  const path = b
    ? `M0,40 C${b[0] * 40},${40 - b[1] * 40} ${b[2] * 40},${40 - b[3] * 40} 40,0`
    : `M0,40 L40,0`
  return (
    <figure data-part="canvas-preview" data-kind="easing">
      <div data-stage>
        <svg viewBox="0 0 40 40" width={48} height={48}>
          <path d={path} fill="none" stroke="currentColor" strokeWidth={2} />
        </svg>
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

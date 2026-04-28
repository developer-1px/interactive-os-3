import type { CSSProperties } from 'react'
import type { PreviewProps } from './types'
import { Caption } from './Caption'

/** css 문자열("background-color: X; color: Y;") → React style */
function cssToStyle(css: string): CSSProperties {
  const out: Record<string, string> = {}
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const k = decl.slice(0, i).trim()
    const v = decl.slice(i + 1).trim()
    if (!k || !v) continue
    out[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v
  }
  return out as CSSProperties
}

export function PairPreview({ value, name, call }: PreviewProps) {
  const style = cssToStyle(value)
  return (
    <figure data-part="canvas-preview" data-kind="pair">
      <div data-stage style={{ ...style, display: 'grid', placeItems: 'center', font: '600 28px system-ui' }}>
        Aa
      </div>
      <Caption name={name} call={call} />
    </figure>
  )
}

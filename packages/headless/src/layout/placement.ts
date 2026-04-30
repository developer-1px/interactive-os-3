import type { CSSProperties } from 'react'
import type { Align, CommonNodeData } from './nodes'

/** Compute inline style + data attributes for a node (grow/width/align/aspect + container vars). */
export function placementAttrs(d: Partial<CommonNodeData>): {
  style?: CSSProperties
  'data-ds-grow'?: 'true'
  'data-ds-width'?: ''
  'data-ds-narrow'?: ''
  'data-ds-align'?: Align
  'data-ds-place'?: Align
  'data-ds-aspect'?: 'square' | string
} {
  const out: ReturnType<typeof placementAttrs> = {}
  const style: CSSProperties = {}
  if (d.grow) out['data-ds-grow'] = 'true'
  if (d.width !== undefined) {
    out['data-ds-width'] = ''
    style.inlineSize = typeof d.width === 'number' ? `${d.width}px` : d.width
  }
  if (d.maxWidth !== undefined) {
    out['data-ds-narrow'] = ''
    style.maxInlineSize = typeof d.maxWidth === 'number' ? `${d.maxWidth}px` : d.maxWidth
  }
  if (d.align) out['data-ds-align'] = d.align
  if (d.place) out['data-ds-place'] = d.place
  if (d.aspect !== undefined) {
    out['data-ds-aspect'] = d.aspect === 'square' ? 'square' : String(d.aspect)
  }
  if (Object.keys(style).length > 0) out.style = style
  return out
}

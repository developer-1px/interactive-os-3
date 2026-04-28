/**
 * LayerPage — single-layer flat preview wrapper.
 *
 * /canvas (zoom-pan overview) 와 분리된 개별 layer 검증 페이지용 wrapper.
 * fixed positioning · ZoomPanCanvas ❌ — flat HTML 흐름.
 *
 * 헤더는 자식 section 의 ColumnBanner 가 담당 (중복 ❌). LayerPage 는 padding/배경만.
 */
import type { ReactNode } from 'react'

export function LayerPage({ children }: { children: ReactNode }) {
  return (
    <div data-part="canvas-layer-page">
      {children}
    </div>
  )
}

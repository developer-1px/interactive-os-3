import { css } from '../css'

/**
 * hairline thickness scalar — hairline(sel) mixin과 별개로 두께 값만 필요할 때.
 * @demo type=value fn=hairlineWidth
 */
export const hairlineWidth = () => `var(--ds-hairline)`

/* focus-ring thickness scalar 는 focus/ring.ts 의 ringWidth() 로 이동 — domain hierarchy.
   shape/hairline.ts 는 hairline 도메인 전용. */

/**
 * Hairline divider — 리스트 행 사이 분리선.
 *
 * 색·두께·last-child(또는 first-child) 미적용을 한 곳에 박아 모든 widget 이
 * 동일한 hairline 을 갖도록 한다. side='block-end' 가 기본 (대부분의 행 리스트).
 */
/** @demo type=structural fn=hairline args=["li"] */
export const hairline = (sel: string, side: 'block-end' | 'block-start' = 'block-end') => {
  const last = side === 'block-end' ? ':last-child' : ':first-child'
  return css`
    :where(${sel}) { border-${side}: 1px solid var(--ds-border); }
    :where(${sel})${last} { border-${side}-color: transparent; }
  `
}

import { css, currentTint, radius } from '../../tokens/semantic'

/**
 * Skeleton — 로딩 placeholder. 단색 box. shimmer 없음 (motion 부담 없음).
 * 크기는 호출부 inline-size/block-size (style prop)으로 결정.
 */
export const cssSkeleton = () => css`
  :where(span[data-part="skeleton"]) {
    display: inline-block;
    inline-size: 4em;
    block-size: 1em;
    background: ${currentTint('soft')};
    border-radius: ${radius('sm')};
    vertical-align: middle;
  }
`

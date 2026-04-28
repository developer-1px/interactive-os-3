import { css, currentTint, radius, typography } from '../../tokens/semantic'
import { square } from '../../tokens/semantic/layout/square'

/**
 * Avatar — 사람·엔티티 식별 부품. <img> 또는 fallback initial <span>.
 * 정사각 비율은 structural.square()로 강제. 크기는 호출부 inline-size로 결정 (variant 없음).
 */
export const cssAvatar = () => css`
  ${square('img[data-part="avatar"], span[data-part="avatar"]')}
  :where(img[data-part="avatar"], span[data-part="avatar"]) {
    inline-size: 2em;
    border-radius: ${radius('pill')};
    overflow: hidden;
    background: ${currentTint('soft')};
    color: inherit;
    ${typography('captionStrong')}
    object-fit: cover;
    user-select: none;
    flex: none;
  }
`

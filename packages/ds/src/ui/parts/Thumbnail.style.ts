import { css, currentTint, radius } from '../../tokens/foundations'
import { dim } from '../../tokens/palette'

/**
 * Thumbnail — aspect-ratio 보존 미리보기 미디어.
 * 호출부가 inline-size를 결정. ratio는 data-ratio attribute로 (variant 아님, 데이터).
 */
export const cssThumbnail = () => css`
  :where(img[data-part="thumbnail"]) {
    display: block;
    inline-size: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    background: ${currentTint('soft')};
    border-radius: ${radius('sm')};
  }
  img[data-part="thumbnail"][data-ratio="16/9"] { aspect-ratio: 16 / 9; }
  img[data-part="thumbnail"][data-ratio="4/3"]  { aspect-ratio: 4 / 3; }
  img[data-part="thumbnail"][data-ratio="3/4"]  { aspect-ratio: 3 / 4; }
  img[data-part="thumbnail"][data-ratio="1/1"]  { aspect-ratio: 1 / 1; }
`

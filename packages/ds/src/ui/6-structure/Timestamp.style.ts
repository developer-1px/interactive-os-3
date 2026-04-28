import { css, mute } from '../../tokens/semantic'

/**
 * Timestamp — <time datetime>. mute로 약화. 색은 currentColor 기반 → surface flip 안전.
 */
export const cssTimestamp = () => css`
  :where(time) {
    ${mute(2)}
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
`

import { accent, css, dim, radius } from '../../foundations'

/**
 * Progress — linear, determinate. <progress data-part="progress">.
 * native progress 위에 톤 정리 — 트랙은 dim, fill은 accent.
 */
export const progress = () => css`
  :where(progress[data-part="progress"]) {
    appearance: none;
    inline-size: 100%;
    block-size: 6px;
    border: 0;
    border-radius: ${radius('pill')};
    overflow: hidden;
    background: ${dim(8)};
  }
  progress[data-part="progress"]::-webkit-progress-bar {
    background: ${dim(8)};
    border-radius: ${radius('pill')};
  }
  progress[data-part="progress"]::-webkit-progress-value {
    background: ${accent()};
    border-radius: ${radius('pill')};
  }
  progress[data-part="progress"]::-moz-progress-bar {
    background: ${accent()};
    border-radius: ${radius('pill')};
  }
`

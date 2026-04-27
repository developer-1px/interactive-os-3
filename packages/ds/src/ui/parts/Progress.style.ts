import { accent, css, dim, radius } from '../../tokens/foundations'

export const progress = () => css`
  :where(progress) {
    appearance: none;
    inline-size: 100%;
    block-size: 6px;
    border: 0;
    border-radius: ${radius('pill')};
    overflow: hidden;
    background: ${dim(8)};
  }
  progress::-webkit-progress-bar {
    background: ${dim(8)};
    border-radius: ${radius('pill')};
  }
  progress::-webkit-progress-value {
    background: ${accent()};
    border-radius: ${radius('pill')};
  }
  progress::-moz-progress-bar {
    background: ${accent()};
    border-radius: ${radius('pill')};
  }
`

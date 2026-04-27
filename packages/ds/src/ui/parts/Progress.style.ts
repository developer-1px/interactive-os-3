import { accent, css, currentTint, dim, radius } from '../../tokens/foundations'

export const progress = () => css`
  :where(progress) {
    appearance: none;
    inline-size: 100%;
    block-size: 6px;
    border: 0;
    border-radius: ${radius('pill')};
    overflow: hidden;
    background: ${currentTint('soft')};
  }
  progress::-webkit-progress-bar {
    background: ${currentTint('soft')};
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

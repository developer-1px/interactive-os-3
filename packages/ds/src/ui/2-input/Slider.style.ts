import { bg, border, control, css, ringWidth, hairlineWidth, radius, shadow } from '../../tokens/semantic'
// input[type="range"] — native role=slider. DS 토큰 기반 풀 커스텀 (native와 섞지 않음).
//   track:  4px channel — control-channel(neutral-4) 위에 thumb까지 accent fill로 진행도 표시
//   thumb:  control('h') 정사각 원, bg + control-border + elev-1
//   accent-color로 WebKit/Firefox 모두 native progress fill 색을 한 번에 잡음
export const cssSlider = () => css`
  :where(input[type="range"]) {
    appearance: none; -webkit-appearance: none;
    width: 100%; height: ${control('h')};
    background: transparent; padding: 0; border: 0;
    accent-color: var(--ds-accent);
  }
  :where(input[type="range"])::-webkit-slider-runnable-track {
    height: 4px; background: var(--ds-control-channel);
    border-radius: ${radius('pill')};
  }
  :where(input[type="range"])::-moz-range-track {
    height: 4px; background: var(--ds-control-channel);
    border-radius: ${radius('pill')};
  }
  :where(input[type="range"])::-moz-range-progress {
    height: 4px; background: var(--ds-accent);
    border-radius: ${radius('pill')};
  }
  :where(input[type="range"])::-webkit-slider-thumb {
    appearance: none; -webkit-appearance: none;
    width: 16px; height: 16px; border-radius: ${radius('pill')};
    background: ${bg()}; border: ${ringWidth()} solid var(--ds-accent); box-shadow: ${shadow()};
    margin-top: -6px;
  }
  :where(input[type="range"])::-moz-range-thumb {
    appearance: none;
    width: 16px; height: 16px; border-radius: ${radius('pill')};
    background: ${bg()}; border: ${ringWidth()} solid var(--ds-accent); box-shadow: ${shadow()};
  }
  :where(input[type="range"]):hover::-webkit-slider-thumb,
  :where(input[type="range"]):focus-visible::-webkit-slider-thumb {
    border-color: var(--ds-accent); box-shadow: 0 0 0 4px color-mix(in oklab, var(--ds-accent) 20%, transparent);
  }
  :where(input[type="color"]) {
    width: ${control('h')}; height: ${control('h')};
    padding: 2px; border: ${hairlineWidth()} solid ${border()};
    border-radius: var(--ds-radius); background: ${bg()};
  }
  :where(input[type="color"])::-webkit-color-swatch-wrapper { padding: 0; }
  :where(input[type="color"])::-webkit-color-swatch { border: none; border-radius: calc(var(--ds-radius) - 2px); }
`

import { css } from '../../../fn'

// input[type="range"] — native role=slider. 토큰 기반 얇은 스타일.
export const sliderCss = css`
  :where(input[type="range"]) {
    appearance: none; -webkit-appearance: none;
    width: 100%; height: var(--ds-control-h);
    background: transparent; padding: 0; border: 0;
  }
  :where(input[type="range"])::-webkit-slider-runnable-track,
  :where(input[type="range"])::-moz-range-track {
    height: 2px; background: var(--ds-border); border-radius: 999px;
  }
  :where(input[type="range"])::-webkit-slider-thumb,
  :where(input[type="range"])::-moz-range-thumb {
    appearance: none; -webkit-appearance: none;
    width: calc(var(--ds-control-h) - 8px); height: calc(var(--ds-control-h) - 8px);
    border-radius: 50%;
    background: var(--ds-bg); border: 1px solid var(--ds-border); box-shadow: var(--ds-shadow);
  }
  :where(input[type="range"])::-webkit-slider-thumb {
    margin-top: calc(-1 * (var(--ds-control-h) - 8px) / 2 + 1px);
  }
  :where(input[type="color"]) {
    width: var(--ds-control-h); height: var(--ds-control-h);
    padding: 2px; border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius); background: var(--ds-bg);
  }
  :where(input[type="color"])::-webkit-color-swatch-wrapper { padding: 0; }
  :where(input[type="color"])::-webkit-color-swatch { border: none; border-radius: calc(var(--ds-radius) - 2px); }
`

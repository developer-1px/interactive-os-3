import { css } from '../../fn'

// Progress / Meter — 네이티브 요소를 토큰 기반으로 얇게 스타일.
// aria-valuenow는 native progress/meter의 value 속성으로 반영되므로 별도 attr() 불필요.
export const valueCss = css`
  :where(progress), :where(meter) {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: calc(var(--ds-space) * 2);
    border: 1px solid var(--ds-border);
    border-radius: 999px;
    background: transparent;
    overflow: hidden;
  }
  :where(progress)::-webkit-progress-bar,
  :where(meter)::-webkit-meter-bar { background: transparent; border-radius: 999px; }
  :where(progress)::-webkit-progress-value,
  :where(meter)::-webkit-meter-optimum-value {
    background: var(--ds-accent); border-radius: 999px; transition: inline-size 160ms;
  }
  :where(progress)::-moz-progress-bar { background: var(--ds-accent); }
  :where(meter)::-webkit-meter-suboptimum-value    { background: oklch(75% 0.16 80); }
  :where(meter)::-webkit-meter-even-less-good-value { background: oklch(65% 0.22 25); }
`

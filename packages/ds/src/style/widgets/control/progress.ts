import { accent, border, css, hairlineWidth, pad, radius, status } from '../../../foundations'
// Progress / Meter — 네이티브 요소를 토큰 기반으로 얇게 스타일.
// aria-valuenow는 native progress/meter의 value 속성으로 반영되므로 별도 attr() 불필요.
export const valueCss = css`
  :where(progress), :where(meter) {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: ${pad(2)};
    border: ${hairlineWidth()} solid ${border()};
    border-radius: ${radius('pill')};
    background: transparent;
    overflow: hidden;
  }
  :where(progress)::-webkit-progress-bar,
  :where(meter)::-webkit-meter-bar { background: transparent; border-radius: ${radius('pill')}; }
  :where(progress)::-webkit-progress-value,
  :where(meter)::-webkit-meter-optimum-value {
    background: ${accent()}; border-radius: ${radius('pill')}; transition: inline-size 160ms;
  }
  :where(progress)::-moz-progress-bar { background: ${accent()}; }
  :where(meter)::-webkit-meter-suboptimum-value    { background: ${status('warning')}; }
  :where(meter)::-webkit-meter-even-less-good-value { background: ${status('danger')}; }
`

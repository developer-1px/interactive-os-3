import { accent, css, dim, pad, radius, status } from '../../../fn'
export const barChart = () => css`
  .bar-chart {
    margin: 0;
    display: flex; flex-direction: column; gap: ${pad(2)};
  }
  .bar-chart > dl {
    margin: 0;
    display: grid;
    grid-template-columns: auto 1fr auto;
    row-gap: ${pad(1)};
    column-gap: ${pad(2)};
  }
  .bar-chart > dl > div { display: contents; }
  .bar-chart dt {
    font-size: var(--ds-text-sm);
    color: ${dim(70)};
  }
  .bar-chart dd {
    margin: 0;
    display: contents;
  }
  .bar-chart meter {
    appearance: none;
    -webkit-appearance: none;
    inline-size: 100%;
    block-size: 8px;
    align-self: center;
    background: ${dim(6)};
    border: 0;
    border-radius: ${radius('pill')};
    overflow: hidden;
  }
  .bar-chart meter::-webkit-meter-bar {
    background: ${dim(6)};
    border: 0;
    border-radius: ${radius('pill')};
  }
  .bar-chart meter::-webkit-meter-optimum-value,
  .bar-chart meter::-webkit-meter-suboptimum-value,
  .bar-chart meter::-webkit-meter-even-less-good-value {
    background: currentColor;
    border-radius: ${radius('pill')};
    transition: inline-size .3s ease;
  }
  .bar-chart meter::-moz-meter-bar { background: currentColor; }
  .bar-chart dd > span {
    font-size: var(--ds-text-xs);
    font-variant-numeric: tabular-nums;
    color: ${dim(60)};
    min-inline-size: 3ch; text-align: end;
  }
  .bar-chart > dl > div[data-tone="info"]    { color: ${accent()}; }
  .bar-chart > dl > div[data-tone="success"] { color: ${status('success')}; }
  .bar-chart > dl > div[data-tone="warning"] { color: ${status('warning')}; }
  .bar-chart > dl > div[data-tone="danger"]  { color: ${status('danger')}; }
  .bar-chart > figcaption {
    font-size: var(--ds-text-xs);
    color: ${dim(50)};
    text-align: end;
  }
`

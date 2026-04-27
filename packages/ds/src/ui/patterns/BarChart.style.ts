import { accent, css, currentTint, radius, status, text } from '../../tokens/foundations'
import { font } from '../../tokens/palette'
import { dim, pad } from '../../tokens/palette'
export const cssBarChart = () => css`
  [data-part="bar-chart"] {
    margin: 0;
    display: flex; flex-direction: column; gap: ${pad(2)};
  }
  [data-part="bar-chart"] > dl {
    margin: 0;
    display: grid;
    grid-template-columns: auto 1fr auto;
    row-gap: ${pad(1)};
    column-gap: ${pad(2)};
  }
  [data-part="bar-chart"] > dl > div { display: contents; }
  [data-part="bar-chart"] dt {
    font-size: ${font('sm')};
    color: ${text('subtle')};
  }
  [data-part="bar-chart"] dd {
    margin: 0;
    display: contents;
  }
  [data-part="bar-chart"] meter {
    appearance: none;
    -webkit-appearance: none;
    inline-size: 100%;
    block-size: 8px;
    align-self: center;
    background: ${currentTint('soft')};
    border: 0;
    border-radius: ${radius('pill')};
    overflow: hidden;
  }
  [data-part="bar-chart"] meter::-webkit-meter-bar {
    background: ${currentTint('soft')};
    border: 0;
    border-radius: ${radius('pill')};
  }
  [data-part="bar-chart"] meter::-webkit-meter-optimum-value,
  [data-part="bar-chart"] meter::-webkit-meter-suboptimum-value,
  [data-part="bar-chart"] meter::-webkit-meter-even-less-good-value {
    background: currentColor;
    border-radius: ${radius('pill')};
    transition: inline-size .3s ease;
  }
  [data-part="bar-chart"] meter::-moz-meter-bar { background: currentColor; }
  [data-part="bar-chart"] dd > span {
    font-size: ${font('xs')};
    font-variant-numeric: tabular-nums;
    color: ${text('mute')};
    min-inline-size: 3ch; text-align: end;
  }
  [data-part="bar-chart"] > dl > div[data-tone="info"]    { color: ${accent()}; }
  [data-part="bar-chart"] > dl > div[data-tone="success"] { color: ${status('success')}; }
  [data-part="bar-chart"] > dl > div[data-tone="warning"] { color: ${status('warning')}; }
  [data-part="bar-chart"] > dl > div[data-tone="danger"]  { color: ${status('danger')}; }
  [data-part="bar-chart"] > figcaption {
    font-size: ${font('xs')};
    color: ${text('mute')};
    text-align: end;
  }
`

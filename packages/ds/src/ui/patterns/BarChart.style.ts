import { accent, css, currentTint, radius, status, text } from '../../tokens/semantic'
import { font, pad, weight } from '../../tokens/scalar'
export const cssBarChart = () => css`
  [data-part="bar-chart"] {
    margin: 0;
    display: flex; flex-direction: column; gap: ${pad(2)};
  }
  [data-part="bar-chart"] > dl {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: ${pad(1.5)};
  }
  [data-part="bar-chart"] > dl > div {
    display: grid;
    grid-template-columns: minmax(4.5rem, 7rem) minmax(0, 1fr) minmax(3ch, max-content);
    align-items: center;
    column-gap: ${pad(2)};
  }
  [data-part="bar-chart"] dt {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: ${font('sm')};
    color: ${text('subtle')};
  }
  [data-part="bar-chart"] dd {
    display: contents;
    margin: 0;
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
  [data-part="bar-chart"] dd > span {
    min-inline-size: 3ch;
    color: ${text('strong')};
    font-size: ${font('sm')};
    font-variant-numeric: tabular-nums;
    font-weight: ${weight('semibold')};
    text-align: end;
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
  [data-part="bar-chart"] > dl > div[data-variant="info"]    { color: ${accent()}; }
  [data-part="bar-chart"] > dl > div[data-variant="success"] { color: ${status('success')}; }
  [data-part="bar-chart"] > dl > div[data-variant="warning"] { color: ${status('warning')}; }
  [data-part="bar-chart"] > dl > div[data-variant="danger"]  { color: ${status('danger')}; }
  [data-part="bar-chart"] > figcaption {
    font-size: ${font('xs')};
    color: ${text('mute')};
    text-align: end;
  }
`

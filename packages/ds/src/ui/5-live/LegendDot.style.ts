import { accent, css, radius, status, text } from '../../tokens/semantic'
import { font, pad } from '../../tokens/scalar'
export const cssLegendDot = () => css`
  [data-part="legend-dot"] {
    display: inline-flex; align-items: center; gap: ${pad(0.75)};
    font-size: ${font('xs')};
    color: ${text('subtle')};
  }
  [data-part="legend-dot"]::before {
    content: ''; display: inline-block;
    inline-size: .65em; block-size: .65em;
    border-radius: ${radius('pill')};
    background: currentColor;
  }
  [data-part="legend-dot"][data-variant="info"]    { color: ${accent()}; }
  [data-part="legend-dot"][data-variant="success"] { color: ${status('success')}; }
  [data-part="legend-dot"][data-variant="warning"] { color: ${status('warning')}; }
  [data-part="legend-dot"][data-variant="danger"]  { color: ${status('danger')}; }
`

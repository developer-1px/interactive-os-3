import { accent, css, font, radius, status, text } from '../../tokens/foundations'
import { dim, pad } from '../../tokens/palette'
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
  [data-part="legend-dot"][data-tone="info"]    { color: ${accent()}; }
  [data-part="legend-dot"][data-tone="success"] { color: ${status('success')}; }
  [data-part="legend-dot"][data-tone="warning"] { color: ${status('warning')}; }
  [data-part="legend-dot"][data-tone="danger"]  { color: ${status('danger')}; }
`

import { accent, css, dim, font, pad, radius, status } from '../../../fn'
export const legendDot = () => css`
  .legend-dot {
    display: inline-flex; align-items: center; gap: ${pad(0.75)};
    font-size: ${font('xs')};
    color: ${dim(70)};
  }
  .legend-dot::before {
    content: ''; display: inline-block;
    inline-size: .65em; block-size: .65em;
    border-radius: ${radius('pill')};
    background: currentColor;
  }
  .legend-dot[data-tone="info"]    { color: ${accent()}; }
  .legend-dot[data-tone="success"] { color: ${status('success')}; }
  .legend-dot[data-tone="warning"] { color: ${status('warning')}; }
  .legend-dot[data-tone="danger"]  { color: ${status('danger')}; }
`

import { accent, border, css, dim, font, hairlineWidth, pad } from '../../tokens/foundations'
export const top10 = () => css`
  [data-part="top-10"] {
    counter-reset: rank;
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column;
  }
  [data-part="top-10"] > li {
    counter-increment: rank;
    display: grid;
    grid-template-columns: 1.75em 1fr auto;
    align-items: center;
    column-gap: ${pad(2)};
    padding: ${pad(1)} 0;
    border-bottom: ${hairlineWidth()} solid ${border()};
  }
  [data-part="top-10"] > li:last-child { border-bottom: 0; }
  [data-part="top-10"] > li::before {
    content: counter(rank);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: ${font('sm')};
    text-align: center;
    color: ${dim(55)};
  }
  [data-part="top-10"] > li:nth-child(-n+3)::before { color: ${accent()}; }
  [data-part="top-10"] > li > span {
    min-inline-size: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  [data-part="top-10"] > li > small {
    font-variant-numeric: tabular-nums;
    color: ${dim(55)};
  }
`

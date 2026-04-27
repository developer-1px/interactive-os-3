import { css, pad } from '../../../tokens/foundations'

/** RouteGrid — masonry column. Card 자체 시각은 ui/parts/Card.style 가 소유. */
export const routeGrid = () => css`
  [data-part="route-grid"] {
    column-count: 3;
    column-gap: ${pad(3)};
    inline-size: min(100%, 80ch);
    margin-inline: auto;
    padding: ${pad(3)};

    @container (inline-size < 60ch) { column-count: 2 }
    @container (inline-size < 32ch) { column-count: 1 }
  }
  [data-part="route-grid"] > article[data-part="card"] {
    break-inside: avoid;
    margin-block-end: ${pad(3)};
  }
`

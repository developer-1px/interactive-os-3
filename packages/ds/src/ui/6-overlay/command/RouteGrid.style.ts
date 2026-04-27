import { css, pad } from '../../../tokens/foundations'

/** RouteGrid — dialog 안 nav 의 masonry. tag + role 만 셀렉터. data-part 신설 ❌. */
export const routeGrid = () => css`
  [role="dialog"] nav {
    column-count: 3;
    column-gap: ${pad(3)};
    inline-size: min(100%, 80ch);
    margin-inline: auto;
    padding: ${pad(3)};

    @container (inline-size < 60ch) { column-count: 2 }
    @container (inline-size < 32ch) { column-count: 1 }
  }
  [role="dialog"] nav > article[data-part="card"] {
    break-inside: avoid;
    margin-block-end: ${pad(3)};
  }
`

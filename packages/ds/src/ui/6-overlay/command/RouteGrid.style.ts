import { css, pad, font, radius, dim, hairlineWidth, border } from '../../../tokens/foundations'

/**
 * RouteGrid — masonry 카드 그리드 (start.me 톤).
 *
 * column-count 기반 cross-browser masonry. 카드는 column 안에서 break-inside 회피.
 * 카드 내부 list 는 Listbox 가 자체 styling — 이 CSS 는 grid 외곽 + Card 헤딩만.
 */
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

  [data-part="route-grid"] > [data-part="card"] {
    break-inside: avoid;
    margin-block-end: ${pad(3)};
    padding: ${pad(2)};
    border: ${hairlineWidth} solid ${border()};
    border-radius: ${radius(2)};
    display: block;
  }

  [data-part="route-grid"] [data-part="card"] [data-slot="title"] [data-part="heading"] {
    font: ${font('label')};
    color: ${dim(2)};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 ${pad(1)} 0;
    padding-block-end: ${pad(1)};
    border-block-end: ${hairlineWidth} solid ${border()};
  }
`

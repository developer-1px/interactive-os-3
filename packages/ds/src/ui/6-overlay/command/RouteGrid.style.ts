import { css, pad, font, radius, mute, dim, hairlineWidth, border } from '../../../tokens/foundations'

/**
 * RouteGrid — masonry 카드 그리드 (start.me 톤).
 *
 * column-count 기반 cross-browser masonry. 카드는 column 안에서 break-inside 회피.
 * 각 카드 안 ul 은 dense 한 link 리스트. Heading h3 은 카테고리 라벨.
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

  [data-part="route-grid"] > [data-part="card"][data-part~="route-card"] {
    break-inside: avoid;
    margin-block-end: ${pad(3)};
    padding: ${pad(2)};
    border: ${hairlineWidth} solid ${border()};
    border-radius: ${radius(2)};
    display: block;
  }

  [data-part="route-grid"] [data-part="route-card"] [data-slot="title"] [data-part="heading"] {
    font: ${font('label')};
    color: ${dim(2)};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 ${pad(1)} 0;
    padding-block-end: ${pad(1)};
    border-block-end: ${hairlineWidth} solid ${border()};
  }

  [data-part="route-list"] {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: ${pad(0)};
  }

  [data-part="route-list"] li {
    display: block;
    padding: ${pad(1)} ${pad(1)};
    border-radius: ${radius(1)};

    &:hover { background: ${mute(1)} }
  }

  [data-part="route-list"] li a {
    display: block;
    color: inherit;
    text-decoration: none;
    font: ${font('body')};
  }

  [data-part="route-list"] li a:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`

import { css, pad, radius, rowPadding, surface } from '../../fn'

export const dialogCss = css`
  :where(dialog) {
    ${surface(2)}
    color: inherit;
    padding: ${pad(4)};
    border-radius: ${radius('md')};
    max-width: min(90vw, 480px);
    min-width: 280px;
  }
  :where(dialog)::backdrop {
    background: color-mix(in oklch, CanvasText 40%, transparent);
    backdrop-filter: blur(2px);
  }
`

export const tooltipCss = css`
  :where([role="tooltip"]) {
    ${surface(2)}
    padding: ${rowPadding(2)};
    font-size: var(--ds-text-sm);
    border-radius: ${radius('sm')};
    color: inherit;
    pointer-events: none;
  }
`

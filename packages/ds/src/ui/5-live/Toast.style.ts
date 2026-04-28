import { accent, border, css, hairlineWidth, radius, status, surface, text } from '../../tokens/foundations'
import { font, pad } from '../../tokens/palette'

export const cssToast = () => css`
  [data-part="toast-region"] {
    position: fixed;
    inset-block-end: ${pad(3)};
    inset-inline-end: ${pad(3)};
    z-index: 1000;
    display: flex; flex-direction: column; gap: ${pad(1.5)};
    list-style: none; margin: 0; padding: 0;
    pointer-events: none;
    max-inline-size: min(420px, calc(100vw - ${pad(6)}));
  }
  [data-part="toast"] {
    pointer-events: auto;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "title dismiss"
      "description dismiss";
    column-gap: ${pad(2)};
    row-gap: ${pad(0.25)};
    align-items: start;
    background: ${surface('raised')};
    border: ${hairlineWidth()} solid ${border()};
    border-radius: ${radius('md')};
    padding: ${pad(2)} ${pad(2.5)};
    box-shadow: 0 4px 16px rgb(0 0 0 / .12);
    animation: ds-toast-in 200ms ease-out;
  }
  [data-part="toast"] > [data-slot="title"]       { grid-area: title; font-weight: 600; }
  [data-part="toast"] > [data-slot="description"] { grid-area: description; color: ${text('subtle')}; font-size: ${font('sm')}; }
  [data-part="toast"] > [data-part="toast-dismiss"] {
    grid-area: dismiss;
    background: transparent; border: 0;
    color: ${text('mute')};
    cursor: pointer;
    padding: ${pad(0.5)};
    line-height: 1;
  }
  [data-part="toast"][data-variant="info"]    { border-color: ${accent()}; }
  [data-part="toast"][data-variant="success"] { border-color: ${status('success')}; }
  [data-part="toast"][data-variant="warning"] { border-color: ${status('warning')}; }
  [data-part="toast"][data-variant="danger"]  { border-color: ${status('danger')}; }
  @keyframes ds-toast-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-part="toast"] { animation: none; }
  }
`

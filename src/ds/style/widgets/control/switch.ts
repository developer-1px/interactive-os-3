import { accent, bg, control, css, dur, ease, radius, shadow } from '../../../foundations'
export const switchCss = css`
  :where([role="switch"]) {
    --ds-switch-ratio:  1.75;
    --ds-switch-pad:    3px;
    --ds-switch-thumb:  calc(${control('h')} - var(--ds-switch-pad) * 2);
    --ds-switch-travel: calc(${control('h')} * (var(--ds-switch-ratio) - 1));
    width: calc(${control('h')} * var(--ds-switch-ratio));
    padding: var(--ds-switch-pad);
    border-radius: ${radius('pill')};
    background: ${control('channel')};
    min-height: auto; block-size: ${control('h')};
    display: inline-flex;
    align-items: center;
    transition:
      background-color ${dur('base')} ${ease('out')},
      box-shadow ${dur('base')} ${ease('out')};
  }
  :where([role="switch"])[aria-checked="false"]:hover:not([aria-disabled="true"]) {
    background: ${control('borderHover')};
  }
  :where([role="switch"])::before {
    content: '';
    width: var(--ds-switch-thumb);
    height: var(--ds-switch-thumb);
    border-radius: 50%;
    background: ${bg()};
    box-shadow: ${shadow()};
    transition: transform ${dur('base')} ${ease('spring')};
  }
  :where([role="switch"])[aria-checked="true"] { background: ${accent()}; }
  :where([role="switch"])[aria-checked="true"]::before {
    transform: translateX(var(--ds-switch-travel));
  }
`

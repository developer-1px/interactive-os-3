import { accent, bg, control, css, dur, ease, radius, shadow } from '../../tokens/foundations'
export const cssSwitch = () => css`
  :where([role="switch"]) {
    --switch-ratio:  1.75;
    --switch-pad:    3px;
    --switch-thumb:  calc(${control('h')} - var(--switch-pad) * 2);
    --switch-travel: calc(${control('h')} * (var(--switch-ratio) - 1));
    width: calc(${control('h')} * var(--switch-ratio));
    padding: var(--switch-pad);
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
    width: var(--switch-thumb);
    height: var(--switch-thumb);
    border-radius: ${radius('pill')};
    background: ${bg()};
    box-shadow: ${shadow()};
    transition: transform ${dur('base')} ${ease('spring')};
  }
  :where([role="switch"])[aria-checked="true"] { background: ${accent()}; }
  :where([role="switch"])[aria-checked="true"]::before {
    transform: translateX(var(--switch-travel));
  }
`

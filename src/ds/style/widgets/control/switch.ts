import { css, radius } from '../../../fn'

export const switchCss = css`
  :where([role="switch"]) {
    --ds-switch-ratio:  1.75;
    --ds-switch-pad:    3px;
    --ds-switch-thumb:  calc(var(--ds-control-h) - var(--ds-switch-pad) * 2);
    --ds-switch-travel: calc(var(--ds-control-h) * (var(--ds-switch-ratio) - 1));
    width: calc(var(--ds-control-h) * var(--ds-switch-ratio));
    padding: var(--ds-switch-pad);
    border-radius: ${radius('pill')};
    background: var(--ds-control-channel);
    min-height: auto; block-size: var(--ds-control-h);
    display: inline-flex;
    align-items: center;
    transition:
      background-color var(--ds-dur-base) var(--ds-ease-out),
      box-shadow var(--ds-dur-base) var(--ds-ease-out);
  }
  :where([role="switch"])[aria-checked="false"]:hover:not([aria-disabled="true"]) {
    background: var(--ds-control-border-hover);
  }
  :where([role="switch"])::before {
    content: '';
    width: var(--ds-switch-thumb);
    height: var(--ds-switch-thumb);
    border-radius: 50%;
    background: var(--ds-bg);
    box-shadow: var(--ds-shadow);
    transition: transform var(--ds-dur-base) var(--ds-ease-spring);
  }
  :where([role="switch"])[aria-checked="true"] { background: var(--ds-accent); }
  :where([role="switch"])[aria-checked="true"]::before {
    transform: translateX(var(--ds-switch-travel));
  }
`

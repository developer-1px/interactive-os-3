import { css } from '../../../fn'

export const switchCss = css`
  :where([role="switch"]) {
    width: calc(var(--ds-control-h) * 1.75);
    padding: 2px;
    border-radius: 999px;
    background: var(--ds-border);
    min-height: auto;
    display: inline-flex;
    align-items: center;
  }
  :where([role="switch"])::before {
    content: '';
    width: calc(var(--ds-control-h) - 10px);
    height: calc(var(--ds-control-h) - 10px);
    border-radius: 50%;
    background: var(--ds-bg);
    box-shadow: var(--ds-shadow);
    transition: transform var(--ds-dur-base) var(--ds-ease-spring);
  }
  :where([role="switch"]) {
    transition: background-color var(--ds-dur-base) var(--ds-ease-out);
  }
  :where([role="switch"])[aria-checked="true"] { background: var(--ds-accent); }
  :where([role="switch"])[aria-checked="true"]::before {
    transform: translateX(calc(var(--ds-control-h) * 0.75));
  }
`

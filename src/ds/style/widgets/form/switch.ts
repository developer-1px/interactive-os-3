import { css, radius } from '../../../fn'

export const switchCss = css`
  :where([role="switch"]) {
    /* track = 1.75 × control-h, thumb = control-h - padding×2. padding 3px로 숨 쉬는 공간 확보. */
    --ds-switch-pad: 3px;
    --ds-switch-thumb: calc(var(--ds-control-h) - var(--ds-switch-pad) * 2);
    width: calc(var(--ds-control-h) * 1.75);
    padding: var(--ds-switch-pad);
    border-radius: ${radius('pill')};
    /* off-state — control emphasis ladder의 "control-channel" 단. Checkbox/Radio border보다 한 단계 진함. */
    background: var(--ds-control-channel);
    min-height: auto;
    display: inline-flex;
    align-items: center;
    transition:
      background-color var(--ds-dur-base) var(--ds-ease-out),
      box-shadow var(--ds-dur-base) var(--ds-ease-out);
  }
  :where([role="switch"]):hover:not([aria-disabled="true"]):not([aria-checked="true"]) {
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
    /* track width(1.75h) − thumb(h − pad×2) − pad×2 = 0.75h 이동 */
    transform: translateX(calc(var(--ds-control-h) * 0.75));
  }
`

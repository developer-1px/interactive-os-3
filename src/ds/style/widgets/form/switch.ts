import { css, fg, radius } from '../../../fn'

export const switchCss = css`
  :where([role="switch"]) {
    width: calc(var(--ds-control-h) * 1.75);
    padding: 2px;
    border-radius: ${radius('pill')};
    /* off 상태 — --ds-border(CanvasText 12%)는 너무 얕아 "토글이 있다"는 신호가 약했다.
       gray-4 정도로 올려 비활성 채널이 또렷하게 보이게. */
    background: ${fg(4)};
    min-height: auto;
    display: inline-flex;
    align-items: center;
    transition: background-color var(--ds-dur-base) var(--ds-ease-out);
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
  :where([role="switch"])[aria-checked="true"] { background: var(--ds-accent); }
  :where([role="switch"])[aria-checked="true"]::before {
    transform: translateX(calc(var(--ds-control-h) * 0.75));
  }
`

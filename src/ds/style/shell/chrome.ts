import { css, pad, surface } from '../../fn'

// 앱 셸 크롬 — 특정 앱 이름이 아니라 "window-controls를 가진 main"을 구조로 매칭.
// 모든 앱(finder / inspector / …)이 동일 규칙을 상속한다. classless + structural.
export const chromeCss = css`
  main:has(> header > [aria-roledescription="window-controls"]) {
    position: fixed;
    inset: var(--ds-shell-inset);
    border-radius: var(--ds-shell-radius);
    ${surface(2)}
    display: flex; flex-direction: column; overflow: hidden;
  }
  main:has(> header > [aria-roledescription="window-controls"]) > header {
    display: flex; flex-direction: row; align-items: center; gap: var(--ds-slot-gap);
    height: var(--ds-chrome-h); flex: none;
    padding-inline: ${pad(3)};
    border-bottom: 1px solid var(--ds-border);
    background: color-mix(in oklch, Canvas 95%, CanvasText 5%);
    font-weight: 600;
  }
  main:has(> header > [aria-roledescription="window-controls"])
    > section[aria-roledescription="body"] {
    flex: 1; display: flex; min-height: 0;
  }
  [aria-roledescription="window-controls"] { display: flex; gap: ${pad(2)}; align-items: center; }
  [aria-roledescription="window-controls"] > span {
    width: var(--ds-traffic-size); height: var(--ds-traffic-size);
    border-radius: 50%; border: 1px solid var(--ds-border);
  }
  [aria-roledescription="window-controls"] > span:nth-child(1) { background: var(--ds-traffic-close); }
  [aria-roledescription="window-controls"] > span:nth-child(2) { background: var(--ds-traffic-min); }
  [aria-roledescription="window-controls"] > span:nth-child(3) { background: var(--ds-traffic-max); }
`

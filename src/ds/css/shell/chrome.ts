import { css, pad, surface } from '../../fn'

// Finder 창 셸 + 크롬 (타이틀바). 태그 + aria-roledescription 만으로 매칭.
export const chromeCss = css`
  main[aria-roledescription="finder"] {
    position: fixed;
    inset: var(--ds-shell-inset);
    border-radius: var(--ds-shell-radius);
    ${surface(2)}
    display: flex; flex-direction: column; overflow: hidden;
  }
  main[aria-roledescription="finder"] > header {
    display: flex; align-items: center; gap: var(--ds-slot-gap);
    height: var(--ds-chrome-h); flex: none;
    padding-inline: ${pad(3)};
    border-bottom: 1px solid var(--ds-border);
    background: color-mix(in oklch, Canvas 95%, CanvasText 5%);
    font-weight: 600;
  }
  main[aria-roledescription="finder"] > section[aria-roledescription="body"] {
    flex: 1; display: flex; min-height: 0;
  }
  [aria-roledescription="window-controls"] { display: flex; gap: ${pad(2)}; align-items: center; }
  [aria-roledescription="window-controls"] > span {
    width: var(--ds-traffic-size); height: var(--ds-traffic-size);
    border-radius: 50%; border: 1px solid rgba(0,0,0,0.1);
  }
  [aria-roledescription="window-controls"] > span:nth-child(1) { background: #ff5f57; }
  [aria-roledescription="window-controls"] > span:nth-child(2) { background: #febc2e; }
  [aria-roledescription="window-controls"] > span:nth-child(3) { background: #28c840; }
`

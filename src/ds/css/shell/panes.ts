import { css, icon, icons, pad } from '../../fn'

// Finder 3-컬럼 브라우저: sidebar + columns + preview.
export const panesCss = css`
  nav[aria-roledescription="sidebar"] {
    width: var(--ds-sidebar-w); flex: none; overflow: auto;
    border-inline-end: 1px solid var(--ds-border);
    background: color-mix(in oklch, Canvas 97%, CanvasText 3%);
  }
  section[aria-roledescription="columns"] {
    flex: 1; display: flex; overflow: auto; min-width: 0;
  }
  nav[aria-roledescription="column"] {
    width: var(--ds-column-w); flex: none; overflow-y: auto;
    border-inline-end: 1px solid var(--ds-border);
  }
  /* 컬럼 내 폴더 옵션 — 우측 chevron 자동 주입 */
  nav[aria-roledescription="column"] [role="option"][aria-haspopup="menu"]::after {
    ${icon(icons.chevronRight, '0.8em')}
    margin-inline-start: auto; opacity: .4;
  }
  aside[aria-roledescription="preview"] {
    width: var(--ds-preview-w); flex: none; overflow-y: auto;
    padding: ${pad(6)};
    display: flex; flex-direction: column; gap: ${pad(4)};
  }
  aside[aria-roledescription="preview"] > figure {
    width: 100%; aspect-ratio: 4/3;
    border-radius: ${pad(2)};
    border: 1px solid var(--ds-border);
    background: color-mix(in oklch, Canvas 92%, CanvasText 8%);
    display: grid; place-items: center;
    font-size: 72px; margin: 0;
  }
  aside[aria-roledescription="preview"] h2 {
    font-size: var(--ds-text-lg); font-weight: 600; word-break: break-all; margin: 0;
  }
  aside[aria-roledescription="preview"] h2 + p { opacity: .6; margin: ${pad(0.5)} 0 0; }
  aside[aria-roledescription="preview"] dl {
    display: grid; grid-template-columns: auto 1fr;
    row-gap: ${pad(1.5)}; column-gap: ${pad(3)}; margin: 0;
  }
  aside[aria-roledescription="preview"] dt { opacity: .55; }
  aside[aria-roledescription="preview"] dd {
    margin: 0; text-align: end;
    font-variant-numeric: tabular-nums;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
`

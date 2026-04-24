import { css, icon, pad, surface } from '../../fn'

// 앱별 body 내 pane 배치. chrome.ts는 창 크롬까지, 여기부터가 앱 특성.
export const panesCss = css`
  /* Inspector: canvas가 남은 공간을, aside panel이 고정폭 */
  section[aria-roledescription="canvas"] {
    flex: 1; min-width: 0; overflow: auto; display: grid; place-items: center;
    background: color-mix(in oklch, Canvas 93%, CanvasText 7%);
  }
  section[aria-roledescription="canvas"] > svg {
    width: 100%; height: 100%; max-width: 100%;
  }
  aside[aria-roledescription="panel"] {
    width: var(--ds-panel-w, 280px); flex: none; overflow-y: auto;
    border-inline-start: 1px solid var(--ds-border);
    display: flex; flex-direction: column;
  }
  aside[aria-roledescription="panel"] [role="tabpanel"] {
    display: flex; flex-direction: column;
  }
  section[aria-roledescription="panel-section"] {
    padding: ${pad(3)};
    border-bottom: 1px solid var(--ds-border);
    display: flex; flex-direction: column; gap: ${pad(2)};
  }
  section[aria-roledescription="panel-section"] > h3 {
    font-size: var(--ds-text-sm); font-weight: 600;
    opacity: .6; text-transform: uppercase; letter-spacing: .05em;
    margin: 0;
  }
  [aria-roledescription="field"] {
    display: grid;
    grid-template-columns: 5rem 1fr auto;
    align-items: center; gap: ${pad(2)};
  }
  [aria-roledescription="field"] > label { opacity: .6; font-size: var(--ds-text-sm); }
  [aria-roledescription="field"] > [aria-roledescription="control"] {
    display: flex; align-items: center; gap: ${pad(1)}; min-width: 0;
  }
  [aria-roledescription="field"] > [aria-roledescription="control"] > * { min-width: 0; flex: 1; }
  [aria-roledescription="field"] > [aria-roledescription="unit"] {
    opacity: .5; font-size: var(--ds-text-sm); min-width: 1.5em; text-align: end;
  }

  /* DS Matrix — 컨트롤 하나당 cell 하나, 사람 눈이 일관성 판단 */
  main[aria-roledescription="ds-matrix"] {
    padding: ${pad(6)};
    display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: ${pad(2)};
    max-width: 1400px; margin: 0 auto;
  }
  main[aria-roledescription="ds-matrix"] > header { grid-column: 1 / -1; }
  main[aria-roledescription="ds-matrix"] > header h1 { margin: 0; }
  main[aria-roledescription="ds-matrix"] > header p { opacity: .6; margin: ${pad(1)} 0 0; }
  figure[aria-roledescription="matrix-cell"] {
    ${surface(1)}
    margin: 0;
    border: 1px solid var(--ds-border); border-radius: ${pad(1.5)};
    padding: ${pad(2)};
    display: grid; grid-template-rows: auto 1fr;
    gap: ${pad(1.5)};
    min-height: 120px;
  }
  figure[aria-roledescription="matrix-cell"] > figcaption {
    font-family: ui-monospace, monospace; font-size: var(--ds-text-sm);
    opacity: .7;
  }
  [data-cell-error] {
    color: oklch(55% 0.2 25); font-size: .75em;
    white-space: pre-wrap; word-break: break-word;
  }

  /* Finder panes */
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
    ${icon('chevronRight', '0.8em')}
    margin-inline-start: auto; opacity: .4;
  }
  aside[aria-roledescription="preview"] {
    width: var(--ds-preview-w); flex: none; overflow-y: auto;
    padding: ${pad(6)};
    display: flex; flex-direction: column; gap: ${pad(4)};
  }
  aside[aria-roledescription="preview"] > figure {
    ${surface(1)}
    width: 100%; aspect-ratio: 4/3;
    border-radius: ${pad(2)};
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

  /* edu-portal-admin — admin 백오피스 셸 (sidebar | workspace / topbar + content) */
  main[aria-roledescription="edu-portal-admin-app"] {
    height: 100vh; display: flex; flex-direction: column; overflow: hidden;
  }
  main[aria-roledescription="edu-portal-admin-app"] > section[aria-roledescription="body"] {
    flex: 1; display: flex; min-height: 0;
  }
  section[aria-roledescription="workspace"] {
    flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 0;
  }
  header[aria-roledescription="topbar"] {
    flex: none;
    padding: ${pad(3)} ${pad(6)};
    border-bottom: 1px solid var(--ds-border);
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(3)};
  }
  header[aria-roledescription="topbar"] > hgroup h1 {
    font-size: var(--ds-text-xl); font-weight: 600; margin: 0;
  }
  header[aria-roledescription="topbar"] > hgroup p {
    opacity: .6; margin: ${pad(0.5)} 0 0;
  }
  header[aria-roledescription="topbar"] > [aria-roledescription="actions"] {
    display: flex; gap: ${pad(2)};
  }
  section[aria-roledescription="content"] {
    flex: 1; overflow: auto; padding: ${pad(6)};
    display: flex; flex-direction: column; gap: ${pad(6)};
  }
`

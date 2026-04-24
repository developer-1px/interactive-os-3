import { css, dim, fg, icon, microLabel, pad, radius, status, surface } from '../../fn'

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
    ${microLabel()}
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
    color: ${status('danger')}; font-size: .75em;
    white-space: pre-wrap; word-break: break-word;
  }

  /* ── Sidebar (2026) ───────────────────────────────────────────────
     - 하드 divider 대신 gray-1 틴트 배경으로 본문과 분리
     - header / sections / footer 3단 수직 flow, footer는 하단 고정
     - section 헤더는 uppercase micro-label
     - Listbox 내부 padding 제거 — sidebar 외곽이 padding을 제공
     - option은 radius + subtle hover (global selected/hover가 이미 tint 제공)
     - scrollbar 얇게, 필요 시만 노출 */
  nav[aria-roledescription="sidebar"] {
    width: var(--ds-sidebar-w); flex: none;
    overflow-y: auto; overflow-x: hidden;
    background: ${fg(1)};
    display: flex; flex-direction: column;
    padding: ${pad(3)} ${pad(2)};
    gap: ${pad(3)};
    scrollbar-width: thin;
  }
  nav[aria-roledescription="sidebar"] > header {
    padding: ${pad(1.5)} ${pad(2)};
    display: grid; gap: ${pad(0.25)};
  }
  nav[aria-roledescription="sidebar"] > header > strong {
    font-size: var(--ds-text-md);
    font-weight: 700;
    letter-spacing: var(--ds-tracking);
  }
  nav[aria-roledescription="sidebar"] > header > small {
    font-size: var(--ds-text-xs);
    color: ${dim(55)};
  }
  nav[aria-roledescription="sidebar"] > section {
    display: flex; flex-direction: column; gap: ${pad(0.5)};
  }
  nav[aria-roledescription="sidebar"] > section > h3 {
    ${microLabel()}
    margin: 0 0 ${pad(1)};
    padding: 0 ${pad(2)};
  }
  /* sidebar 안의 Listbox는 컨테이너 padding/grid를 리셋 — option만 밀도 있게 쌓임 */
  nav[aria-roledescription="sidebar"] [role="listbox"] {
    padding: 0;
    gap: ${pad(0.25)};
    row-gap: ${pad(0.25)};
  }
  nav[aria-roledescription="sidebar"] [role="option"] {
    border-radius: ${radius('md')};
    padding: ${pad(1.25)} ${pad(2)};
  }
  nav[aria-roledescription="sidebar"] > footer {
    margin-top: auto;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: ${pad(2)};
    padding: ${pad(2)};
    border-radius: ${radius('md')};
    background: ${fg(2)};
    font-size: var(--ds-text-sm);
  }
  nav[aria-roledescription="sidebar"] > footer > small {
    color: ${dim(55)};
    font-size: var(--ds-text-xs);
  }

  /* Finder panes
     - columns: 내용 자연 폭만 사용. 넘치면 자체 가로 스크롤.
     - preview: 남는 공간 전부 차지, 단 var(--ds-preview-w)를 최소 폭으로 유지. */
  section[aria-roledescription="columns"] {
    flex: 0 1 auto; display: flex; overflow: auto; min-width: 0;
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
    flex: 1 1 0; min-width: var(--ds-preview-w);
    overflow-x: hidden; overflow-y: auto;
    padding: ${pad(6)};
    display: flex; flex-direction: column; gap: ${pad(4)};
  }
  /* preview 내부 코드/이미지는 자기 폭 안에서 해결 — preview 자체에 가로 스크롤 금지 */
  aside[aria-roledescription="preview"] > pre,
  aside[aria-roledescription="preview"] > article pre {
    max-width: 100%; overflow-x: auto; margin: 0;
  }
  /* shiki 출력에 줄번호 부여 — <span class="line"> 카운터 */
  aside[aria-roledescription="preview"] pre code {
    counter-reset: line;
    display: block;
  }
  aside[aria-roledescription="preview"] pre code .line {
    counter-increment: line;
  }
  aside[aria-roledescription="preview"] pre code .line::before {
    content: counter(line);
    display: inline-block;
    width: 2.5em;
    margin-inline-end: ${pad(3)};
    text-align: end;
    opacity: .35;
    user-select: none;
  }
  aside[aria-roledescription="preview"] > article {
    max-width: 100%; min-width: 0;
    overflow-wrap: anywhere; word-break: break-word;
  }
  aside[aria-roledescription="preview"] img {
    max-width: 100%; height: auto;
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

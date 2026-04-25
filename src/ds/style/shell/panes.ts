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
  /* list-view: columns와 달리 자기 폭을 자연스럽게 채우되 preview와 공유.
     basis 자동 + 1단계 grow → preview의 min-width(var(--ds-preview-w))가 보장되는
     남은 공간을 ListView가 차지. 행 수가 많으면 자체 세로 스크롤. */
  section[aria-roledescription="list-view"] {
    flex: 1 1 0; min-width: 0; overflow: auto;
    display: block;
  }
  section[aria-roledescription="list-view"] [role="treegrid"] {
    table-layout: fixed;
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

  /* FloatingNav — 우측 하단 FAB. popover의 위치/크기는 [aria-roledescription="floating-nav"]
     안에 든 popover에 한해 우하단 anchor로 강제. 그 외 popover는 overlay.ts 기본 centered. */
  aside[aria-roledescription="floating-nav"] {
    position: fixed;
    inset-block-end: ${pad(4)};
    inset-inline-end: ${pad(4)};
    z-index: 100;
  }
  aside[aria-roledescription="floating-nav"] > button {
    width: 3.5rem; height: 3.5rem;
    border-radius: 50%;
    border: 1px solid var(--ds-border);
    ${surface(3)}
    color: inherit;
    font-size: 1.5rem; line-height: 1;
    cursor: pointer;
    box-shadow: 0 4px 16px color-mix(in oklch, CanvasText 18%, transparent);
    transition: transform var(--ds-dur-fast) var(--ds-ease-out);
  }
  aside[aria-roledescription="floating-nav"] > button:hover { transform: scale(1.05); }
  aside[aria-roledescription="floating-nav"] > button:active { transform: scale(0.96); }
  /* floating-nav 안에서 popover만 우하단 anchor로 띄움 */
  aside[aria-roledescription="floating-nav"] [popover][aria-roledescription="popover"] {
    inset: auto;
    inset-inline-end: ${pad(4)};
    inset-block-end: calc(${pad(4)} + 3.5rem + ${pad(2)});
    inline-size: min(92vw, 28rem);
    max-block-size: min(70vh, 32rem);
    overflow: auto;
  }

  menu[aria-roledescription="route-grid"] {
    list-style: none; margin: 0; padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    gap: ${pad(2)};
  }
  menu[aria-roledescription="route-grid"] > li > a {
    display: flex; flex-direction: column; align-items: center; gap: ${pad(1)};
    padding: ${pad(2)} ${pad(1)};
    border-radius: ${radius('md')};
    color: inherit; text-decoration: none;
    transition: background var(--ds-dur-fast) var(--ds-ease-out);
  }
  menu[aria-roledescription="route-grid"] > li > a:hover {
    background: color-mix(in oklch, var(--ds-fg) 6%, transparent);
  }
  menu[aria-roledescription="route-grid"] > li > a > figure {
    margin: 0;
    width: 3rem; height: 3rem;
    display: grid; place-items: center;
    border-radius: ${radius('md')};
    border: 1px solid var(--ds-border);
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
    font-size: 1.25rem; font-weight: 700;
    font-family: ui-rounded, ui-sans-serif, sans-serif;
    color: ${dim(55)};
  }
  menu[aria-roledescription="route-grid"] > li > a > strong {
    font-size: var(--ds-text-xs); font-weight: 500; text-align: center;
    word-break: keep-all; line-height: 1.3;
  }

  /* edu-portal-admin — admin 백오피스 셸 (sidebar | workspace / topbar + content) */
  main[aria-roledescription="edu-portal-admin-app"] {
    height: 100vh; display: flex; flex-direction: column; overflow: hidden;
    container-type: inline-size; container-name: shell;
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

  /* Catalog — ds ui zone-first 감사 대시보드. edu-portal-admin 과 동일한 셸 구조,
     content 영역은 zone 섹션이 위계로 쌓인다 (h2 zone, h3 component card). */
  main[aria-roledescription="catalog-app"] {
    height: 100vh; display: flex; flex-direction: column; overflow: hidden;
    container-type: inline-size; container-name: shell;
  }
  main[aria-roledescription="catalog-app"] > section[aria-roledescription="body"] {
    flex: 1; display: flex; min-height: 0;
  }
  dl[aria-roledescription="catalog-stats"] {
    margin: 0; display: flex; gap: ${pad(5)}; align-items: baseline;
  }
  dl[aria-roledescription="catalog-stats"] > div { display: grid; gap: ${pad(0.25)}; }
  dl[aria-roledescription="catalog-stats"] dt {
    ${microLabel()}
    margin: 0;
  }
  dl[aria-roledescription="catalog-stats"] dd {
    margin: 0; font-size: var(--ds-text-lg); font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  dl[aria-roledescription="catalog-stats"] [data-tone="good"] { color: ${status('success')}; }
  dl[aria-roledescription="catalog-stats"] [data-tone="warn"] { color: ${status('warning')}; }

  section[aria-roledescription="catalog-zone"] {
    display: flex; flex-direction: column; gap: ${pad(3)};
  }
  section[aria-roledescription="catalog-zone"] > header {
    border-bottom: 1px solid var(--ds-border);
    padding-bottom: ${pad(2)};
    display: flex; align-items: baseline; gap: ${pad(2)};
  }
  section[aria-roledescription="catalog-zone"] > header > h2 {
    margin: 0; font-size: var(--ds-text-xl); font-weight: 700;
    letter-spacing: var(--ds-tracking);
  }
  section[aria-roledescription="catalog-zone"] > header > small {
    color: ${dim(55)}; font-size: var(--ds-text-sm);
    font-variant-numeric: tabular-nums;
  }
  section[aria-roledescription="catalog-zone"] > p {
    margin: 0; color: ${dim(55)}; font-size: var(--ds-text-sm); max-width: 60ch;
  }

  ul[aria-roledescription="catalog-grid"] {
    list-style: none; margin: 0; padding: 0;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: ${pad(3)};
  }

  article[aria-roledescription="catalog-card"] {
    ${surface(1)}
    margin: 0;
    border: 1px solid var(--ds-border); border-radius: ${pad(2)};
    padding: ${pad(3)};
    display: flex; flex-direction: column; gap: ${pad(2)};
  }
  article[aria-roledescription="catalog-card"] > header {
    display: flex; align-items: baseline; gap: ${pad(1.5)}; flex-wrap: wrap;
  }
  article[aria-roledescription="catalog-card"] > header > h3 {
    margin: 0; font-size: var(--ds-text-md); font-weight: 600;
  }
  article[aria-roledescription="catalog-card"] > header > [data-badge] {
    padding: ${pad(0.25)} ${pad(1)}; border-radius: ${radius('pill')};
    font-size: var(--ds-text-xs); font-weight: 600;
    background: color-mix(in oklch, var(--ds-fg) 8%, transparent);
  }
  article[aria-roledescription="catalog-card"] > header > [data-badge][data-tone="good"] {
    background: color-mix(in oklch, ${status('success')} 14%, transparent);
    color: ${status('success')};
  }
  article[aria-roledescription="catalog-card"] > header > [data-badge][data-tone="warn"] {
    background: color-mix(in oklch, ${status('warning')} 14%, transparent);
    color: ${status('warning')};
  }
  article[aria-roledescription="catalog-card"] > header > [data-badge][data-tone="bad"] {
    background: color-mix(in oklch, ${status('danger')} 14%, transparent);
    color: ${status('danger')};
  }
  article[aria-roledescription="catalog-card"] > header > code {
    font-size: var(--ds-text-xs); color: ${dim(55)};
    font-family: ui-monospace, monospace;
  }
  article[aria-roledescription="catalog-card"] > header > small {
    margin-inline-start: auto;
    color: ${dim(55)}; font-size: var(--ds-text-xs);
    font-variant-numeric: tabular-nums;
  }
  article[aria-roledescription="catalog-card"] > [aria-roledescription="card-path"] {
    font-family: ui-monospace, monospace;
    font-size: var(--ds-text-xs); color: ${dim(55)};
  }
  article[aria-roledescription="catalog-card"] > pre {
    margin: 0; padding: ${pad(2)};
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
    border-radius: ${pad(1)}; font-size: var(--ds-text-xs);
    overflow-x: auto; font-family: ui-monospace, monospace;
  }
  article[aria-roledescription="catalog-card"] > figure[aria-roledescription="card-demo"] {
    margin: 0; padding: ${pad(2)};
    border: 1px dashed var(--ds-border);
    border-radius: ${pad(1)};
    background: color-mix(in oklch, var(--ds-fg) 2%, transparent);
    min-height: 56px;
    display: flex; align-items: center;
  }
  article[aria-roledescription="catalog-card"] > ul[aria-roledescription="card-checks"] {
    list-style: none; padding: 0; margin: 0;
    display: grid; gap: ${pad(0.5)}; font-size: var(--ds-text-xs);
  }
  article[aria-roledescription="catalog-card"] [data-pass="true"]  { color: ${status('success')}; }
  article[aria-roledescription="catalog-card"] [data-pass="false"] { color: ${status('danger')}; }
  article[aria-roledescription="catalog-card"] > footer {
    margin: 0; color: ${dim(55)}; font-size: var(--ds-text-xs);
    border-top: 1px solid var(--ds-border); padding-top: ${pad(1.5)};
  }
`

import { css, dim, fg, icon, microLabel, mix, pad, radius, status, grouping, tint } from '../../fn'
import { SHELL_MOBILE_MAX } from '../preset/breakpoints'

// 앱별 body 내 pane 배치. chrome.ts는 창 크롬까지, 여기부터가 앱 특성.
export const panesCss = css`
  /* Inspector: canvas가 남은 공간을, aside panel이 고정폭.
     Outer-layout 정책 — widget이 *invariant*면 widget-level, *contextual*이면 부모 셸이 결정.
     panel은 inspector 단일 소비처 → 부모 셸 셀렉터로 좁힌다. */
  section[aria-roledescription="canvas"] {
    flex: 1; min-width: 0; overflow: auto; display: grid; place-items: center;
    background: color-mix(in oklch, Canvas 93%, CanvasText 7%);
  }
  section[aria-roledescription="canvas"] > svg {
    width: 100%; height: 100%; max-width: 100%;
  }
  /* L1 — Inspector panel의 outer-layout(width)은 inspector-app shell이 소유. */
  main[aria-roledescription="inspector-app"] > section[aria-roledescription="body"] > aside[aria-roledescription="panel"] {
    width: var(--ds-panel-w, 280px); flex: none; overflow-y: auto;
    border-inline-start: var(--ds-hairline) solid var(--ds-border);
  }
  /* widget-internal layout (column flow, tabpanel)은 widget이 소유. */
  aside[aria-roledescription="panel"] {
    display: flex; flex-direction: column;
  }
  aside[aria-roledescription="panel"] [role="tabpanel"] {
    display: flex; flex-direction: column;
  }
  section[aria-roledescription="panel-section"] {
    padding: ${pad(3)};
    border-bottom: var(--ds-hairline) solid var(--ds-border);
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
    ${grouping(1)}
    margin: 0;
    border: var(--ds-hairline) solid var(--ds-border); border-radius: ${pad(1.5)};
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

  /* sidebar surface 는 widgets/composite/sidebar.ts 가 owner — 여기서 다시 정의하지 않는다.
     모바일 드로어 변형은 아래 catalog-app/edu-portal-admin-app 의 [data-nav-open] 규칙으로 유지. */

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
    /* L3 — 자기 폭에 따라 보조 컬럼 reflow. viewport가 아닌 자기 컨테이너 기준. */
    container-type: inline-size;
    container-name: list-view;
  }
  /* 좁은 컨테이너 — 보조 컬럼(수정일/크기/종류) 숨김, 이름만. tap 친화 행 높이. */
  @container list-view (max-width: 480px) {
    section[aria-roledescription="list-view"] [role="treegrid"] colgroup col:nth-child(n+2),
    section[aria-roledescription="list-view"] [role="treegrid"] thead th:nth-child(n+2),
    section[aria-roledescription="list-view"] [role="treegrid"] tbody td:nth-child(n+2) {
      display: none;
    }
    section[aria-roledescription="list-view"] [role="treegrid"] tbody td:first-child {
      padding-block: ${pad(1.5)};
      font-size: var(--ds-text-md);
    }
  }
  section[aria-roledescription="list-view"] [role="treegrid"] {
    table-layout: fixed;
  }
  section[aria-roledescription="list-view"] col[data-col="name"]  { inline-size: auto; }
  section[aria-roledescription="list-view"] col[data-col="mtime"] { inline-size: 14rem; }
  section[aria-roledescription="list-view"] col[data-col="size"]  { inline-size: 6rem; }
  section[aria-roledescription="list-view"] col[data-col="kind"]  { inline-size: 8rem; }
  /* L1 — Columns 내부 column의 outer-layout(width)은 columns 부모가 소유. */
  section[aria-roledescription="columns"] > nav[aria-roledescription="column"] {
    width: var(--ds-column-w); flex: none; overflow-y: auto;
    border-inline-end: var(--ds-hairline) solid var(--ds-border);
  }
  /* 컬럼 내 폴더 옵션 — 우측 chevron 자동 주입 (widget-internal) */
  nav[aria-roledescription="column"] [role="option"][aria-haspopup="menu"]::after {
    ${icon('chevronRight', '0.8em')}
    margin-inline-start: auto; opacity: .4;
  }
  /* Preview widget 본체 — outer layout(min-width/flex) 결정은 부모 셸이 소유.
     desktop Finder body는 아래 별도 규칙에서 min-width를 지정, 모바일/모달 등 다른
     컨텍스트에서는 자기 컨테이너 크기를 따른다. */
  aside[aria-roledescription="preview"] {
    overflow-x: hidden; overflow-y: auto;
    display: flex; flex-direction: column;
    min-width: 0;
    /* L3 — 자기 폭에 따라 코드 soft-wrap. viewport 모름. */
    container-type: inline-size;
    container-name: preview;
  }
  /* L1 desktop Finder layout — preview에 min-width를 부여하는 책임은 여기. */
  main[aria-roledescription="finder"] > section[aria-roledescription="body"] > aside[aria-roledescription="preview"] {
    flex: 1 1 0;
    min-width: var(--ds-preview-w);
  }
  /* preview 내부 코드/이미지는 자기 폭 안에서 해결 — preview 자체에 가로 스크롤 금지 */
  aside[aria-roledescription="preview"] > pre,
  aside[aria-roledescription="preview"] > article pre {
    max-width: 100%; overflow-x: auto; margin: 0;
  }
  /* 좁은 preview — 코드 soft-wrap. 모바일/좁은 모달에서 가로 스크롤 제거.
     wrap된 줄도 line counter는 .line 단위로 1번만 증가하므로 줄번호 정확. */
  @container preview (max-width: 600px) {
    aside[aria-roledescription="preview"] > pre,
    aside[aria-roledescription="preview"] > article pre {
      white-space: pre-wrap;
      word-break: break-word;
      overflow-wrap: anywhere;
      overflow-x: hidden;
      tab-size: 2;
    }
    aside[aria-roledescription="preview"] pre code .line::before {
      width: 2em;
      margin-inline-end: ${pad(2)};
    }
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
    ${grouping(1)}
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

  /* Finder 모바일 — 데스크톱 메타포(sidebar | columns | preview)를 버린 별도 셸.
     iOS Files 식 drill-down 한 면(Locations → Folder → File). 라우트 컴포넌트가
     isMobile 분기로 FinderMobile을 렌더하므로 CSS는 자기 root 이름만 잡는다. */
  main[aria-roledescription="finder-mobile"] {
    display: flex; flex-direction: column;
    block-size: 100svh; min-block-size: 0;
  }
  main[aria-roledescription="finder-mobile"] > header {
    position: sticky;
    inset-block-start: 0;
    z-index: 1;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: ${pad(2)};
    padding: ${pad(2)} ${pad(3)};
    border-block-end: var(--ds-hairline) solid var(--ds-border);
    background: ${fg(1)};
  }
  main[aria-roledescription="finder-mobile"] > header > button {
    inline-size: 2rem; block-size: 2rem;
    border: 0; background: transparent; color: inherit;
    font-size: 1.5rem; line-height: 1;
    border-radius: ${radius('md')};
    cursor: pointer;
  }
  main[aria-roledescription="finder-mobile"] > header > button:hover {
    background: color-mix(in oklch, CanvasText 8%, transparent);
  }
  main[aria-roledescription="finder-mobile"] > header > h1 {
    margin: 0;
    font-size: var(--ds-text-lg); font-weight: 600;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  main[aria-roledescription="finder-mobile"] > header > h1:only-child {
    grid-column: 1 / -1;
  }
  main[aria-roledescription="finder-mobile"] > section {
    flex: 1 1 0; min-block-size: 0; overflow-y: auto;
    padding: ${pad(3)};
    display: flex; flex-direction: column; gap: ${pad(4)};
  }
  /* Home — 위치/최근 두 섹션 */
  section[aria-roledescription="finder-home"] > section {
    display: flex; flex-direction: column; gap: ${pad(1)};
  }
  section[aria-roledescription="finder-home"] > section > h2 {
    ${microLabel()}
    margin: 0;
  }
  main[aria-roledescription="finder-mobile"] [role="listbox"] {
    padding: 0; gap: ${pad(0.5)};
  }
  section[aria-roledescription="finder-empty"] {
    display: grid; place-items: center;
    color: inherit; opacity: .55;
    padding: ${pad(8)};
  }
  /* TikTok 식 세로 스냅 스와이퍼 — 형제 파일을 한 화면씩 풀-블리드로 쌓는다.
     컨테이너가 main 자식이므로 panes.ts의 일반 finder-mobile > section padding/gap을
     덮어 풀-블리드를 만든다. JS는 진입 시 1회 점프만(useLayoutEffect),
     IO/scroll-sync 없음 (memory: feedback_mobile_js_boundary). */
  main[aria-roledescription="finder-mobile"] > section[aria-roledescription="finder-tiktok"] {
    display: block;
    padding: 0; gap: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;
  }
  article[aria-roledescription="finder-file"] {
    position: relative;
    block-size: 100svh;
    overflow: hidden;
    background: var(--ds-bg);
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  /* preview-fill — preview를 article 풀블리드로 깔기 위한 시맨틱 wrapper.
     div는 roleless라 aria-roledescription을 부여할 수 없으므로 figure 사용. */
  article[aria-roledescription="finder-file"] > figure[aria-roledescription="preview-fill"] {
    margin: 0;
    position: absolute; inset: 0;
    overflow: auto;
    overscroll-behavior: contain;
  }
  /* TikTok top/bottom overlays — gradient mask로 콘텐츠와 분리, safe-area inset 흡수.
     fg(1)이 surface owner이고 alpha gradient를 만든다 (페어 함수 일관). */
  header[aria-roledescription="finder-tiktok-top"],
  aside[aria-roledescription="finder-tiktok-bottom"] {
    position: absolute;
    inset-inline: 0;
    z-index: 1;
    padding-inline: ${pad(3)};
  }
  header[aria-roledescription="finder-tiktok-top"] {
    inset-block-start: 0;
    padding-block-start: calc(env(safe-area-inset-top) + ${pad(2)});
    padding-block-end: ${pad(2)};
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: ${pad(2)};
    background: linear-gradient(
      to bottom,
      color-mix(in oklch, ${fg(1)} 96%, transparent) 30%,
      color-mix(in oklch, ${fg(1)} 70%, transparent) 70%,
      transparent
    );
  }
  header[aria-roledescription="finder-tiktok-top"] > strong {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    min-inline-size: 0;
  }
  aside[aria-roledescription="finder-tiktok-bottom"] {
    inset-block-end: 0;
    padding-block-start: ${pad(2)};
    padding-block-end: calc(env(safe-area-inset-bottom) + ${pad(3)});
    display: flex; flex-wrap: wrap; align-items: center;
    gap: ${pad(2)};
    background: linear-gradient(
      to top,
      color-mix(in oklch, ${fg(1)} 96%, transparent) 30%,
      color-mix(in oklch, ${fg(1)} 70%, transparent) 70%,
      transparent
    );
  }
  /* path — 마지막 small을 trail 위치로 밀고 약화. cell-level color 금지 → opacity. */
  aside[aria-roledescription="finder-tiktok-bottom"] > small:last-child {
    flex: 1; min-inline-size: 0; text-align: end;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    opacity: .6;
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
    border: var(--ds-hairline) solid var(--ds-border);
    ${grouping(3)}
    color: inherit;
    font-size: 1.5rem; line-height: 1;
    cursor: pointer;
    /* 1px hairline ring + 짧은 drop — 큰 blur 흐림 제거 */
    box-shadow:
      0 0 0 1px ${tint('CanvasText', 6)},
      0 1px 2px ${tint('CanvasText', 10)},
      0 4px 10px ${tint('CanvasText', 8)};
    transition: transform var(--ds-dur-fast) var(--ds-ease-out);
  }
  aside[aria-roledescription="floating-nav"] > button:hover { transform: scale(1.05); }
  aside[aria-roledescription="floating-nav"] > button:active { transform: scale(0.96); }
  /* mobile glass override — 진한 frosted + 선명 ring + 짧은 drop. desktop 외형은 위 base 가 유지. */
  @media (hover: none) and (pointer: coarse) {
    aside[aria-roledescription="floating-nav"] > button {
      background: color-mix(in oklch, Canvas 60%, transparent);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
              backdrop-filter: blur(24px) saturate(180%);
      border: var(--ds-hairline) solid ${tint('CanvasText', 10)};
      box-shadow:
        inset 0 1px 0 ${tint('CanvasText', 8)},
        0 0 0 1px ${tint('CanvasText', 4)},
        0 2px 4px ${tint('CanvasText', 10)},
        0 8px 16px ${tint('CanvasText', 8)};
    }
  }
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
    border: var(--ds-hairline) solid var(--ds-border);
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
    font-size: 1.25rem; font-weight: 700;
    font-family: ui-rounded, ui-sans-serif, sans-serif;
    color: ${dim(55)};
  }
  menu[aria-roledescription="route-grid"] > li > a > strong {
    font-size: var(--ds-text-xs); font-weight: 500; text-align: center;
    word-break: keep-all; line-height: 1.3;
  }

  /* Chat 메시지 버블 — 보편 채팅 스타일.
     - me: 우측 정렬, accent 색
     - other: 좌측 정렬, surface
     - max-width 75%, lg radius, small meta 위쪽 */
  [aria-roledescription="chat-page"] [data-emphasis="sunk"]:has([aria-roledescription^="message-"]) {
    gap: ${pad(1.5)};
    align-items: stretch;
    /* page-root inset이 외곽 padding을 책임짐 — sunk 자체 emphasis padding(3)으로 충분, 추가 인셋 없음 */
  }
  [aria-roledescription^="message-"] {
    max-inline-size: min(75%, 36rem);
    padding: ${pad(2)} ${pad(2.5)};
    border-radius: ${radius('lg')};
    display: flex; flex-direction: column;
    gap: ${pad(0.5)};
    margin: 0;
  }
  [aria-roledescription="message-other"] {
    align-self: flex-start;
    background: ${fg(2)};
    border-end-start-radius: ${radius('sm')};
  }
  [aria-roledescription="message-me"] {
    align-self: flex-end;
    background: var(--ds-accent);
    color: var(--ds-accent-on);
    border: 1px solid transparent;
    border-end-end-radius: ${radius('sm')};
  }
  [aria-roledescription^="message-"] > small {
    opacity: .7;
    font-size: var(--ds-text-xs);
    margin: 0;
  }
  [aria-roledescription^="message-"] > p {
    margin: 0;
    line-height: 1.4;
    word-break: break-word;
  }

  /* Board (Slack/Discord 스타일) — 게시판형 채널 타임라인.
     - sidebar: 채널 리스트 (#·🔒 + 이름 + unread)
     - 각 post: avatar | header(name+time) + body
     - 연속 post(post-cont): avatar/header 숨겨 같은 사람 메시지가 묶여 보임 */
  [aria-roledescription="board-page"] [aria-roledescription="board-nav"] {
    padding: ${pad(2)};
    gap: ${pad(2)};
  }
  [aria-roledescription="board-page"] [aria-roledescription="board-nav"] > h3 {
    font-size: var(--ds-text-md); font-weight: 700; margin: 0;
  }
  [aria-roledescription="board-page"] [aria-roledescription="board-nav"] > small {
    color: ${dim(55)}; font-size: var(--ds-text-xs);
  }
  [aria-roledescription="board-page"] button[data-board-ch] {
    justify-content: flex-start;
    background: transparent; border: 0; padding: ${pad(1)} ${pad(2)};
    color: inherit; font-weight: 400;
    border-radius: ${radius('md')};
  }
  [aria-roledescription="board-page"] button[data-board-ch][aria-pressed="true"] {
    background: var(--ds-accent);
    color: var(--ds-accent-on);
  }
  [aria-roledescription="board-page"] button[data-board-ch] > small {
    margin-inline-start: auto;
    background: ${tint('CanvasText', 12)};
    border-radius: ${radius('pill')};
    padding: 0 ${pad(1)};
    font-size: var(--ds-text-xs);
  }
  [aria-roledescription="board-page"] [aria-roledescription="board-stream"] {
    overflow-y: auto;
  }
  [aria-roledescription="board-page"] [aria-roledescription="board-posts"] {
    gap: 0;
    padding: ${pad(2)} 0;
  }
  [aria-roledescription="post"],
  [aria-roledescription="post-cont"] {
    align-items: flex-start;
    padding: ${pad(0.5)} ${pad(2)};
    gap: ${pad(2)};
    transition: background var(--ds-dur-fast) var(--ds-ease-out);
  }
  [aria-roledescription="post"] { padding-top: ${pad(2)}; }
  [aria-roledescription="post"]:hover,
  [aria-roledescription="post-cont"]:hover {
    background: ${tint('CanvasText', 4)};
  }
  /* avatar — 36x36 라운드 사각. inline 크기는 widget이 아니라 CSS가 결정. */
  [aria-roledescription^="post"] > strong[data-ds-aspect="square"] {
    inline-size: 36px;
    border-radius: ${radius('md')};
    overflow: hidden;
    flex: none;
    background: ${tint('CanvasText', 8)};
  }
  [aria-roledescription^="post"] > strong[data-ds-aspect="square"] > img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  /* 연속 post: avatar는 자리만 비워두고 시각 숨김, 헤더 라인 숨김 */
  [aria-roledescription="post-cont"] > strong[data-ds-aspect="square"] {
    visibility: hidden;
    background: transparent;
  }
  [aria-roledescription="post-cont"] > [data-ds="Column"] > strong:first-child {
    display: none;
  }
  /* 본문 컬럼 */
  [aria-roledescription^="post"] > [data-ds="Column"] {
    gap: ${pad(0.25)};
    min-inline-size: 0;
  }
  [aria-roledescription^="post"] > [data-ds="Column"] > strong:first-child {
    font-size: var(--ds-text-md);
  }
  [aria-roledescription^="post"] > [data-ds="Column"] > strong:first-child > small {
    margin-inline-start: ${pad(1)};
    color: ${dim(55)};
    font-weight: 400;
    font-size: var(--ds-text-xs);
  }
  [aria-roledescription^="post"] > [data-ds="Column"] > p {
    margin: 0; line-height: 1.45;
  }

  /* Side-collapse 패턴 — Row[side|main|right] 구조 페이지(feed/chat 등)에서
     좁은 viewport시 좌·우 보조 컬럼을 숨기고 [data-collapse-menu-btn]을 노출.
     roledescription 끝이 "-page"인 모든 곳에 일괄 적용 — content 레벨 container query. */
  [aria-roledescription$="-page"] {
    container-type: inline-size;
    container-name: collapse-sides;
    align-items: stretch;
    justify-content: flex-start;
    padding: ${pad(4)};
    gap: ${pad(4)};
    min-height: 100dvh;
    box-sizing: border-box;
  }
  [aria-roledescription$="-page"] [data-collapse-menu-btn] { display: none; }
  @container collapse-sides (inline-size < 48rem) {
    /* grow 없는 보조 Column(filters/side/right)만 숨김 — main은 grow 보유라 살아남음.
       2-col(filters|main), 3-col(side|main|right) 모두 안전. */
    [aria-roledescription$="-page"] > [data-ds="Column"]:not([data-ds-grow]) {
      display: none;
    }
    [aria-roledescription$="-page"] [data-collapse-menu-btn] {
      display: inline-flex;
    }
    [aria-roledescription$="-page"] > [data-ds="Column"][data-ds-grow] {
      width: 100%; min-width: 0;
    }
    [aria-roledescription$="-page"] {
      padding: ${pad(2)};
      gap: ${pad(2)};
      max-width: 640px; margin-inline: auto;
    }
  }
  /* Feed 카드 레벨 다듬기 — avatar 원형, body 줄높이, reaction toolbar 정렬 */
  [aria-roledescription="feed-page"] [role="article"],
  [aria-roledescription="feed-page"] [data-emphasis="raised"] {
    border-radius: ${radius('lg')};
  }
  /* Feed avatar — width + aspect:square가 정사각형을 잡고, 여기선 배경/원형/정렬/clip만 */
  [aria-roledescription$="-page"] [data-flow="cluster"] > strong[data-ds-aspect="square"] {
    border-radius: 50%;
    overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center;
    background: color-mix(in oklch, var(--ds-fg) 8%, transparent);
    font-size: var(--ds-text-md);
  }
  [aria-roledescription$="-page"] [data-flow="cluster"] > strong[data-ds-aspect="square"] > img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  [aria-roledescription$="-page"] [data-flow="cluster"] > strong[data-ds-grow] > small {
    display: block;
    font-weight: 400;
    color: ${dim(55)};
    font-size: var(--ds-text-xs);
    margin-top: ${pad(0.25)};
  }
  /* 포스트/카드 본문 이미지 — 카드 폭 채우고 라운딩 + aspect 보존 */
  [aria-roledescription$="-page"] [data-emphasis="raised"] > p > img {
    width: 100%; height: auto; display: block;
    border-radius: ${radius('md')};
    aspect-ratio: 16 / 9; object-fit: cover;
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
  }
  /* Shop 카드의 첫 텍스트 슬롯이 이미지일 때(상품 썸네일) — 정사각형 비율, 카드 라운딩 동기화 */
  [aria-roledescription="shop-page"] [data-emphasis="raised"] > p:first-child {
    margin: 0; padding: 0;
  }
  [aria-roledescription="shop-page"] [data-emphasis="raised"] > p:first-child > img {
    width: 100%; height: auto; display: block;
    aspect-ratio: 1 / 1; object-fit: cover;
    border-radius: ${radius('md')};
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
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
    border-bottom: var(--ds-hairline) solid var(--ds-border);
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

  /* nav-toggle은 데스크톱에서 숨김 — admin/catalog 공통 */
  main[aria-roledescription="edu-portal-admin-app"] [aria-roledescription="nav-toggle"] { display: none; }

  /* edu-portal-admin 모바일 — sidebar 좌측 드로어 + topbar/content 컴팩트 */
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    main[aria-roledescription="edu-portal-admin-app"] [aria-roledescription="nav-toggle"] {
      display: inline-flex; align-items: center; justify-content: center;
      inline-size: 2.25rem; block-size: 2.25rem;
      border: var(--ds-hairline) solid var(--ds-border); border-radius: ${radius('md')};
      background: var(--ds-bg); cursor: pointer; flex: none;
      position: absolute; inset-block-start: ${pad(2)}; inset-inline-start: ${pad(2)};
      z-index: 10;
    }
    /* sidebar 드로어화 */
    main[aria-roledescription="edu-portal-admin-app"] > section[aria-roledescription="body"] > nav[aria-roledescription="sidebar"] {
      position: fixed;
      inset-block: 0; inset-inline-start: 0;
      inline-size: min(80vw, 18rem);
      z-index: 50;
      transform: translateX(-100%);
      transition: transform var(--ds-dur-fast) var(--ds-ease-out);
      box-shadow: 0 0 24px color-mix(in oklch, CanvasText 12%, transparent);
    }
    main[aria-roledescription="edu-portal-admin-app"][data-nav-open="true"] > section[aria-roledescription="body"] > nav[aria-roledescription="sidebar"] {
      transform: translateX(0);
    }
    main[aria-roledescription="edu-portal-admin-app"] > section[aria-roledescription="body"] > button[aria-roledescription="scrim"] {
      position: fixed; inset: 0; z-index: 49;
      background: color-mix(in oklch, CanvasText 35%, transparent);
      border: 0;
    }

    /* workspace는 nav-toggle을 위한 padding 확보 */
    main[aria-roledescription="edu-portal-admin-app"] > section[aria-roledescription="body"] > section[aria-roledescription="workspace"] {
      position: relative;
    }
    /* topbar 컴팩트 — title 좌측 padding(toggle 자리), 부제 숨김, h1 축소 */
    main[aria-roledescription="edu-portal-admin-app"] header[aria-roledescription="topbar"] {
      padding: ${pad(2)} ${pad(2)} ${pad(2)} calc(${pad(2)} + 2.25rem + ${pad(1.5)});
      gap: ${pad(2)};
    }
    main[aria-roledescription="edu-portal-admin-app"] header[aria-roledescription="topbar"] > hgroup h1 {
      font-size: var(--ds-text-md);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      min-inline-size: 0;
    }
    main[aria-roledescription="edu-portal-admin-app"] header[aria-roledescription="topbar"] > hgroup p { display: none; }

    /* content 패딩 ↓ + safe-area */
    main[aria-roledescription="edu-portal-admin-app"] > section[aria-roledescription="body"] > section[aria-roledescription="workspace"] > section[aria-roledescription="content"] {
      padding: ${pad(2)} max(${pad(2)}, env(safe-area-inset-left)) ${pad(4)} max(${pad(2)}, env(safe-area-inset-right));
      gap: ${pad(3)};
    }
  }

  /* catalog-page — definePage 단일 화면. sidebar | workspace 좌우 분리 스크롤.
     page 자체는 viewport 높이로 잠그고 overflow:hidden, sidebar는 widget이 owner
     (overflow-y:auto 보유), Main(workspace)만 여기서 자체 스크롤로 풀어준다. */
  [aria-roledescription="catalog-page"] {
    height: 100dvh; min-height: 0; overflow: hidden;
    padding: 0; gap: 0;
  }
  [aria-roledescription="catalog-page"] > main {
    overflow-y: auto; overflow-x: hidden;
    min-block-size: 0;
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
    border-bottom: var(--ds-hairline) solid var(--ds-border);
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
    ${grouping(1)}
    margin: 0;
    border: var(--ds-hairline) solid var(--ds-border); border-radius: ${pad(2)};
    padding: ${pad(3)};
    display: flex; flex-direction: column; gap: ${pad(2)};
    cursor: pointer;
    transition: border-color var(--ds-dur-fast) var(--ds-ease-out),
                box-shadow var(--ds-dur-fast) var(--ds-ease-out);
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
    border-top: var(--ds-hairline) solid var(--ds-border); padding-top: ${pad(1.5)};
  }

  /* Catalog preview — 카드 클릭 시 우측 aside에 큰 demo + 상세. body가
     workspace + preview 2단으로 갈라진다. data-preview-open이 없으면 preview는
     남아있지만 폭 0에 가깝게 접힘. */
  main[aria-roledescription="catalog-app"] > section[aria-roledescription="body"]
    > aside[aria-roledescription="preview"] {
    display: none;
  }
  main[aria-roledescription="catalog-app"][data-preview-open="true"]
    > section[aria-roledescription="body"]
    > aside[aria-roledescription="preview"] {
    display: flex; flex-direction: column; gap: ${pad(3)};
    flex: 0 0 var(--ds-preview-w, 480px);
    border-inline-start: var(--ds-hairline) solid var(--ds-border);
    background: ${fg(1)};
    padding: ${pad(4)};
    overflow-y: auto;
  }
  aside[aria-roledescription="preview"] > header {
    display: flex; align-items: flex-start; gap: ${pad(2)};
  }
  aside[aria-roledescription="preview"] > header > hgroup { flex: 1; min-width: 0; }
  aside[aria-roledescription="preview"] > header > hgroup > h2 {
    margin: 0; font-size: var(--ds-text-xl); font-weight: 700;
  }
  aside[aria-roledescription="preview"] > header > hgroup > p {
    margin: ${pad(0.5)} 0 0;
    display: flex; gap: ${pad(1.5)}; align-items: baseline; flex-wrap: wrap;
    color: ${dim(55)}; font-size: var(--ds-text-sm);
  }
  aside[aria-roledescription="preview"] > header > hgroup > p > code {
    font-family: ui-monospace, monospace; font-size: var(--ds-text-xs);
  }
  aside[aria-roledescription="preview"] > header > button {
    inline-size: 2rem; block-size: 2rem;
    border: 0; background: transparent; color: inherit; cursor: pointer;
    font-size: 1.25rem; line-height: 1; border-radius: ${radius('md')};
  }
  aside[aria-roledescription="preview"] > header > button:hover {
    background: color-mix(in oklch, CanvasText 8%, transparent);
  }
  aside[aria-roledescription="preview"] > figure[aria-roledescription="card-demo"] {
    margin: 0; padding: ${pad(4)};
    border: 1px dashed var(--ds-border);
    border-radius: ${pad(1.5)};
    background: color-mix(in oklch, var(--ds-fg) 2%, transparent);
    min-block-size: 200px;
    display: flex; align-items: center; justify-content: center;
  }
  aside[aria-roledescription="preview"] > pre {
    margin: 0; padding: ${pad(2.5)};
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
    border-radius: ${pad(1)}; font-size: var(--ds-text-xs);
    overflow-x: auto; font-family: ui-monospace, monospace;
  }
  aside[aria-roledescription="preview"] > ul[aria-roledescription="card-checks"] {
    list-style: none; padding: 0; margin: 0;
    display: grid; gap: ${pad(0.75)}; font-size: var(--ds-text-sm);
  }
  aside[aria-roledescription="preview"] [data-pass="true"]  { color: ${status('success')}; }
  aside[aria-roledescription="preview"] [data-pass="false"] { color: ${status('danger')}; }

  /* 카드 클릭 어포던스 + 선택 표식 (base 는 위 article[catalog-card] 블록에 통합) */
  article[aria-roledescription="catalog-card"]:hover {
    border-color: color-mix(in oklch, var(--ds-accent) 40%, var(--ds-border));
  }
  article[aria-roledescription="catalog-card"][aria-current="true"] {
    border-color: var(--ds-accent);
    box-shadow: 0 0 0 1px var(--ds-accent);
  }

  /* 모바일 — preview는 화면 전체를 덮는 오버레이로 */
  @container shell (max-width: ${SHELL_MOBILE_MAX}) {
    main[aria-roledescription="catalog-app"][data-preview-open="true"]
      > section[aria-roledescription="body"]
      > aside[aria-roledescription="preview"] {
      position: fixed; inset: 0; z-index: 50;
      flex: none; inline-size: 100%;
      border-inline-start: 0;
    }
  }

  /* topbar의 nav-toggle은 데스크톱에서 숨김, 모바일에서만 노출 */
  main[aria-roledescription="catalog-app"] [aria-roledescription="nav-toggle"] { display: none; }

  /* Catalog 모바일 — sidebar는 좌측 드로어로 숨기고, 카드는 1라인(이름+badge+소비처)으로 압축 */
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    main[aria-roledescription="catalog-app"] [aria-roledescription="nav-toggle"] {
      display: inline-flex; align-items: center; justify-content: center;
      inline-size: 2.25rem; block-size: 2.25rem;
      border: var(--ds-hairline) solid var(--ds-border); border-radius: ${radius('md')};
      background: var(--ds-bg); cursor: pointer; flex: none;
    }
    /* sidebar를 좌측에서 슬라이드 인하는 드로어로 — 기본 닫힘(translateX(-100%)) */
    main[aria-roledescription="catalog-app"] > section[aria-roledescription="body"] > nav[aria-roledescription="sidebar"] {
      position: fixed;
      inset-block: 0; inset-inline-start: 0;
      inline-size: min(80vw, 18rem);
      z-index: 50;
      transform: translateX(-100%);
      transition: transform var(--ds-dur-fast) var(--ds-ease-out);
      box-shadow: 0 0 24px color-mix(in oklch, CanvasText 12%, transparent);
    }
    main[aria-roledescription="catalog-app"][data-nav-open="true"] > section[aria-roledescription="body"] > nav[aria-roledescription="sidebar"] {
      transform: translateX(0);
    }
    /* scrim — 드로어 열릴 때만 표시 */
    main[aria-roledescription="catalog-app"] > section[aria-roledescription="body"] > button[aria-roledescription="scrim"] {
      position: fixed; inset: 0; z-index: 49;
      background: color-mix(in oklch, CanvasText 35%, transparent);
      border: 0;
    }

    /* topbar 압축 — stats는 숨김, 부제 1줄로 자르기 */
    main[aria-roledescription="catalog-app"] header[aria-roledescription="topbar"] {
      gap: ${pad(2)};
    }
    main[aria-roledescription="catalog-app"] header[aria-roledescription="topbar"] > hgroup > p { display: none; }
    main[aria-roledescription="catalog-app"] header[aria-roledescription="topbar"] > hgroup > h1 {
      font-size: var(--ds-text-md);
    }
    main[aria-roledescription="catalog-app"] dl[aria-roledescription="catalog-stats"] { display: none; }

    /* zone 헤더 컴팩트 + 부연 설명 숨김 */
    section[aria-roledescription="catalog-zone"] > p { display: none; }
    section[aria-roledescription="catalog-zone"] > header > h2 { font-size: var(--ds-text-md); }

    /* grid → 1열 list */
    ul[aria-roledescription="catalog-grid"] {
      grid-template-columns: 1fr;
      gap: ${pad(1)};
    }

    /* 카드 1라인 — 이름 + badge + 소비처만, 나머지는 모두 숨김 */
    article[aria-roledescription="catalog-card"] {
      flex-direction: row; align-items: center; gap: ${pad(1.5)};
      padding: ${pad(1.5)} ${pad(2)};
      border-radius: ${radius('md')};
      min-block-size: 0;
    }
    article[aria-roledescription="catalog-card"] > header {
      flex: 1; min-inline-size: 0; gap: ${pad(1.5)};
      flex-wrap: nowrap;
    }
    article[aria-roledescription="catalog-card"] > header > h3 {
      font-size: var(--ds-text-sm); font-weight: 600;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      min-inline-size: 0;
    }
    article[aria-roledescription="catalog-card"] > header > code { display: none; }
    article[aria-roledescription="catalog-card"] > header > small {
      font-size: var(--ds-text-xs); flex: none;
    }
    article[aria-roledescription="catalog-card"] > [aria-roledescription="card-path"],
    article[aria-roledescription="catalog-card"] > pre,
    article[aria-roledescription="catalog-card"] > figure[aria-roledescription="card-demo"],
    article[aria-roledescription="catalog-card"] > ul[aria-roledescription="card-checks"],
    article[aria-roledescription="catalog-card"] > footer {
      display: none;
    }
  }

  /* Atlas — 카드는 컨텐츠. 모바일 퍼스트(1열, 안전 패딩) → 데스크톱은 동일 카드 DOM의 다열 reflow.
     "shell·control은 데스크톱·모바일 별도 구현" 원칙은 header/preset switcher에만 적용. */
  main[aria-roledescription="atlas-app"] {
    display: flex; flex-direction: column;
    min-block-size: 100svh;
    overflow-x: hidden;
  }

  main[aria-roledescription="atlas-app"] > header {
    display: flex; flex-wrap: wrap;
    align-items: center; gap: ${pad(2)} ${pad(3)};
    padding: ${pad(3)} max(${pad(3)}, env(safe-area-inset-left));
    border-block-end: var(--ds-hairline) solid var(--ds-border);
    position: sticky; top: 0; z-index: 1;
    background: var(--ds-bg);
    /* L3 — 자기 폭으로 subtitle inline 복귀 결정. viewport 모름. */
    container-type: inline-size;
    container-name: atlas-header;
  }
  main[aria-roledescription="atlas-app"] > header > h1 {
    margin: 0; font-size: var(--ds-text-lg); font-weight: 700;
  }
  main[aria-roledescription="atlas-app"] > header > p {
    margin: 0; color: ${dim(55)}; font-size: var(--ds-text-sm);
    inline-size: 100%; order: 99;
  }
  main[aria-roledescription="atlas-app"] > header > [data-roledescription="preset-switcher"] {
    margin-inline-start: auto;
    display: inline-flex; align-items: center; gap: ${pad(1)};
    font-size: var(--ds-text-sm);
  }
  main[aria-roledescription="atlas-app"] > header select {
    padding: ${pad(0.5)} ${pad(1.5)};
    border-radius: ${radius('sm')};
    border: var(--ds-hairline) solid var(--ds-border);
    background: var(--ds-bg);
    font-size: var(--ds-text-sm);
  }
  /* 헤더가 충분히 넓으면 subtitle을 인라인 복귀. viewport 아닌 자기 헤더 폭 기준. */
  @container atlas-header (min-width: 720px) {
    main[aria-roledescription="atlas-app"] > header > p {
      inline-size: auto; order: 0;
    }
  }

  main[aria-roledescription="atlas-app"] > section {
    padding: ${pad(3)} max(${pad(3)}, env(safe-area-inset-left)) ${pad(4)} max(${pad(3)}, env(safe-area-inset-right));
    display: flex; flex-direction: column; gap: ${pad(4)};
  }
  main[aria-roledescription="atlas-app"] > section + section {
    border-block-start: var(--ds-hairline) solid var(--ds-border);
  }
  main[aria-roledescription="atlas-app"] > section > h2 {
    margin: 0; font-size: var(--ds-text-md); font-weight: 700;
  }
  main[aria-roledescription="atlas-app"] > section > h2 > small {
    color: ${dim(55)}; font-size: .85em; font-weight: 500;
  }

  section[aria-roledescription="atlas-fn-group"] {
    display: flex; flex-direction: column; gap: ${pad(2)};
  }
  section[aria-roledescription="atlas-fn-group"] > h3 {
    ${microLabel()}
    margin: 0;
  }

  /* 카드 grid — 자기 폭에 따라 1열/auto-fill 결정. viewport가 아닌 컨테이너 기준. */
  [aria-roledescription="atlas-card-grid"] {
    display: grid;
    grid-template-columns: 1fr;
    gap: ${pad(2)};
    container-type: inline-size;
    container-name: atlas-card-grid;
  }
  @container atlas-card-grid (min-width: 480px) {
    [aria-roledescription="atlas-card-grid"] {
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    }
  }

  /* 카드 — 데스크톱과 모바일에서 동일 시각, 패딩만 약간 ↓ on narrow */
  article[aria-roledescription="atlas-card"] {
    ${grouping(1)}
    border: var(--ds-hairline) solid var(--ds-border);
    border-radius: ${radius('md')};
    padding: ${pad(2)};
    display: flex; flex-direction: column; gap: ${pad(1.5)};
    min-inline-size: 0;
  }
  article[aria-roledescription="atlas-card"] > header {
    display: flex; align-items: center; gap: ${pad(1)};
    min-inline-size: 0;
  }
  article[aria-roledescription="atlas-card"] [data-role="title"] {
    font-size: var(--ds-text-sm); font-weight: 600;
    overflow-wrap: anywhere; min-inline-size: 0;
  }
  article[aria-roledescription="atlas-card"] [aria-roledescription="atlas-usage"] {
    margin-inline-start: auto;
    font-size: var(--ds-text-xs); font-weight: 600;
    padding: ${pad(0.25)} ${pad(0.75)};
    border-radius: ${radius('pill')};
    background: color-mix(in oklab, var(--ds-accent) 14%, transparent);
    color: var(--ds-accent);
    flex: none;
  }
  article[aria-roledescription="atlas-card"] [aria-roledescription="atlas-usage"][data-dead="true"] {
    background: color-mix(in oklab, var(--ds-danger) 20%, transparent);
    color: var(--ds-danger);
  }
  figure[aria-roledescription="atlas-demo"] {
    margin: 0;
    min-block-size: 48px;
    padding: ${pad(1)};
    border-radius: ${radius('sm')};
    background: ${mix('Canvas', 97, 'CanvasText')};
    display: flex; align-items: center; justify-content: center;
  }
  article[aria-roledescription="atlas-card"] > p {
    margin: 0; font-size: var(--ds-text-xs);
    color: ${dim(55)}; line-height: 1.5;
  }
  article[aria-roledescription="atlas-card"] [data-role="signature"] {
    font-size: var(--ds-text-xs); color: ${dim(55)};
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    overflow-wrap: anywhere;
  }
  article[aria-roledescription="atlas-card"] details > summary {
    font-size: var(--ds-text-xs); color: ${dim(55)}; cursor: pointer;
  }
  ul[aria-roledescription="atlas-call-sites"] {
    margin: ${pad(0.75)} 0 0; padding: 0 0 0 ${pad(2)};
    font-size: var(--ds-text-xs); color: ${dim(55)};
    max-block-size: 160px; overflow: auto;
  }

  /* Atlas Leak Table — 모바일 가로 스크롤, snippet 1줄 유지 */
  [aria-roledescription="atlas-leaks"] > p[data-tone="good"] { color: ${status('success')}; }
  [aria-roledescription="atlas-leak-list"] > details { margin-block-end: ${pad(1)}; }
  [aria-roledescription="atlas-leak-list"] summary {
    cursor: pointer; font-size: var(--ds-text-sm);
    padding: ${pad(0.5)} 0;
  }
  [aria-roledescription="atlas-leak-list"] summary > small { color: ${dim(55)}; }
  table[aria-roledescription="atlas-leak-table"] {
    inline-size: 100%; font-size: var(--ds-text-xs);
    margin-block-start: ${pad(0.5)};
    border-collapse: collapse;
    display: block; overflow-x: auto;
  }
  table[aria-roledescription="atlas-leak-table"] thead tr { color: ${dim(55)}; text-align: start; }
  table[aria-roledescription="atlas-leak-table"] tbody tr { border-block-start: var(--ds-hairline) solid var(--ds-border); }
  table[aria-roledescription="atlas-leak-table"] :is(th, td) {
    padding: ${pad(0.5)} ${pad(1)}; text-align: start; vertical-align: top;
  }
  table[aria-roledescription="atlas-leak-table"] :is(th, td)[data-col="line"] {
    inline-size: 4rem; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  table[aria-roledescription="atlas-leak-table"] :is(th, td)[data-col="kind"] { inline-size: 6rem; }
  table[aria-roledescription="atlas-leak-table"] td[data-col="snippet"] {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-inline-size: 480px;
  }

  /* Markdown viewer — 데스크톱은 중앙 정렬 + 여백, 모바일은 폭 100% + safe-area */
  main[aria-roledescription="markdown-app"] {
    display: flex; flex-direction: column; gap: ${pad(3)};
    padding: ${pad(4)} max(${pad(4)}, env(safe-area-inset-left)) ${pad(8)} max(${pad(4)}, env(safe-area-inset-right));
    min-block-size: 100svh;
    overflow-x: hidden;
  }
  main[aria-roledescription="markdown-app"] > nav[aria-label="경로"] {
    inline-size: 100%; max-inline-size: 72ch; margin-inline: auto;
    font-size: var(--ds-text-sm); opacity: .8;
  }
  main[aria-roledescription="markdown-app"] > nav[aria-label="경로"] > code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    overflow-wrap: anywhere; min-inline-size: 0;
  }
  main[aria-roledescription="markdown-app"] > article {
    inline-size: 100%; margin-inline: auto;
  }
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    main[aria-roledescription="markdown-app"] {
      padding: ${pad(2)} max(${pad(2)}, env(safe-area-inset-left)) ${pad(6)} max(${pad(2)}, env(safe-area-inset-right));
      gap: ${pad(2)};
    }
  }

  /* ── 표준 컨텐츠 위젯 (entity zone) ───────────────────────────────
     ds/ui/entity/ 의 widget들이 root 1곳에 className(카탈로그) + roledescription을
     달고 들어오면, 셀렉터는 roledescription만 잡는다. width/inline-size는 CSS가 결정. */

  /* FeedPost — SNS 피드 카드 */
  article[aria-roledescription="feed-post"] {
    display: flex; flex-direction: column; gap: ${pad(2)};
    padding: ${pad(3)};
    border-radius: ${radius('lg')};
  }
  article[aria-roledescription="feed-post"] > header {
    display: flex; align-items: center; gap: ${pad(2)};
  }
  article[aria-roledescription="feed-post"] > header > strong[data-ds-aspect="square"] {
    inline-size: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex: none;
    background: color-mix(in oklch, var(--ds-fg) 8%, transparent);
  }
  article[aria-roledescription="feed-post"] > header > strong[data-ds-aspect="square"] > img {
    inline-size: 100%; block-size: 100%; object-fit: cover; display: block;
  }
  article[aria-roledescription="feed-post"] > header > strong:nth-of-type(2) {
    flex: 1; min-inline-size: 0;
  }
  article[aria-roledescription="feed-post"] > header > strong:nth-of-type(2) > small {
    display: block;
    font-weight: 400;
    color: ${dim(55)};
    font-size: var(--ds-text-xs);
    margin-block-start: ${pad(0.25)};
  }
  article[aria-roledescription="feed-post"] > p > img {
    inline-size: 100%; block-size: auto; display: block;
    border-radius: ${radius('md')};
    aspect-ratio: 16 / 9; object-fit: cover;
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
  }
  article[aria-roledescription="feed-post"] > p { margin: 0; line-height: 1.45; }
  article[aria-roledescription="feed-post"] > footer[role="toolbar"] {
    display: flex; gap: ${pad(2)};
  }

  /* ProductCard — 커머스 상품 카드 */
  article[aria-roledescription="product-card"] {
    display: flex; flex-direction: column; gap: ${pad(1.5)};
    padding: ${pad(2)};
    border-radius: ${radius('lg')};
  }
  article[aria-roledescription="product-card"] > p:first-child { margin: 0; padding: 0; }
  article[aria-roledescription="product-card"] > p:first-child > img {
    inline-size: 100%; block-size: auto; display: block;
    aspect-ratio: 1 / 1; object-fit: cover;
    border-radius: ${radius('md')};
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
  }
  article[aria-roledescription="product-card"] > strong {
    font-size: var(--ds-text-md); font-weight: 600;
    overflow: hidden; text-overflow: ellipsis;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  article[aria-roledescription="product-card"] > p {
    margin: 0; display: flex; align-items: baseline; gap: ${pad(1.5)};
  }
  article[aria-roledescription="product-card"] > p > strong {
    font-size: var(--ds-text-lg); font-weight: 700;
  }
  article[aria-roledescription="product-card"] > p > small > s { color: ${dim(55)}; }
  article[aria-roledescription="product-card"] > p > mark {
    background: color-mix(in oklch, ${status('danger')} 14%, transparent);
    color: ${status('danger')};
    padding: ${pad(0.25)} ${pad(1)};
    border-radius: ${radius('pill')};
    font-size: var(--ds-text-xs); font-weight: 600;
  }
  article[aria-roledescription="product-card"] > small { color: ${dim(55)}; font-size: var(--ds-text-xs); }
  article[aria-roledescription="product-card"] > p[role="list"] {
    display: flex; flex-wrap: wrap; gap: ${pad(0.5)};
  }
  article[aria-roledescription="product-card"] > p[role="list"] > span {
    background: color-mix(in oklch, var(--ds-fg) 8%, transparent);
    padding: ${pad(0.25)} ${pad(1)};
    border-radius: ${radius('pill')};
    font-size: var(--ds-text-xs);
  }
  article[aria-roledescription="product-card"] > button {
    margin-block-start: auto;
  }
`

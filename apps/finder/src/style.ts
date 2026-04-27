import { css, icon, typography, weight } from '@p/ds/tokens/foundations'
import { pad } from '@p/ds/tokens/palette'

// Finder desktop — sidebar / columns / list-view / preview.
// (sidebar surface 자체는 widgets/composite/sidebar.ts owner.)
export const finderCss = css`
  /* chrome 없는 finder shell — 풀뷰포트 컨테이너 + body flex */
  main[data-part="finder"] {
    position: fixed; inset: 0; overflow: hidden;
    display: flex; flex-direction: column;
    container-type: inline-size; container-name: shell;
  }
  main[data-part="finder"] > [data-part="body"] {
    flex: 1; min-height: 0;
  }
  /* 3-pane 구조 — 각 pane은 toolbar(top) + body 세로 스택.
     pane-toolbar 높이는 토큰 1개로 통일하여 가로 키라인을 일치시킨다 (균형/대칭). */
  main[data-part="finder"] section[data-part="pane"] {
    display: flex; flex-direction: column;
    min-width: 0; min-height: 0; overflow: hidden;
    border: var(--ds-hairline) solid var(--ds-border);
    border-radius: ${pad(1.5)};
    background: color-mix(in oklch, Canvas 98%, CanvasText 2%);
  }
  /* Split separator 항상 보이는 미세 hairline — 패널 사이 구분 명확 */
  main[data-part="finder"] [data-ds="Split"][data-axis="row"] > [role="separator"][data-ds-handle]::before {
    opacity: 0.5;
  }
  /* finder-main — Split 우측 트랙 내부에서 columns(auto) + preview(1fr) grid.
     columns pane은 컬럼 내용 만큼만 차지하고, preview pane이 남는 공간을 흡수. */
  main[data-part="finder"] [data-part="finder-main"] {
    display: grid;
    grid-template-columns: auto 1fr;
    min-width: 0; min-height: 0; overflow: hidden;
    gap: ${pad(1)};
  }
  main[data-part="finder"] section[data-part="pane"] > header[data-part="pane-toolbar"] {
    flex: none;
    display: flex; align-items: center; gap: ${pad(2)};
    padding-inline: ${pad(2)};
    block-size: var(--ds-control-h);
    background: transparent;
    border: 0;
  }
  /* 내부 Toolbar 컴포넌트의 자체 surface(padding/bg/radius)를 무력화 —
     pane-toolbar zone이 단일 컨테이너 역할을 하므로 중복 시각 계층 제거.
     모든 컨트롤(button, input)을 control('h')로 통일하여 가로 키라인에 정렬. */
  main[data-part="finder"] section[data-part="pane"] > header[data-part="pane-toolbar"] [role="toolbar"] {
    display: flex; gap: ${pad(0.5)};
    padding: 0; background: transparent; border-radius: 0; row-gap: 0;
  }
  main[data-part="finder"] section[data-part="pane"] > header[data-part="pane-toolbar"] button,
  main[data-part="finder"] section[data-part="pane"] > header[data-part="pane-toolbar"] input {
    block-size: var(--ds-control-h);
    line-height: 1;
    box-sizing: border-box;
  }
  main[data-part="finder"] section[data-part="pane"] > header[data-part="pane-toolbar"] form[role="search"] {
    margin-inline-start: auto;
    display: flex; align-items: center; flex: 1;
  }
  main[data-part="finder"] section[data-part="pane"] > header[data-part="pane-toolbar"] input[type="search"] {
    inline-size: 100%;
  }
  /* sidebar 접기 버튼 — control-h 정사각, ghost */
  main[data-part="finder"] section[data-pane="sidebar"] > header[data-part="pane-toolbar"] > button {
    aspect-ratio: 1;
    border: 0; background: transparent; cursor: pointer;
    border-radius: ${pad(1)};
  }
  main[data-part="finder"] section[data-pane="sidebar"] > header[data-part="pane-toolbar"] > button:hover {
    background: color-mix(in oklch, Canvas 92%, CanvasText 8%);
  }
  /* pane body — toolbar 아래 영역 1fr */
  main[data-part="finder"] section[data-pane="sidebar"] > nav[data-part="sidebar"],
  main[data-part="finder"] section[data-pane="columns"] > section[data-part="columns"],
  main[data-part="finder"] section[data-pane="preview"] > aside[data-part="preview"] {
    flex: 1 1 0; min-height: 0; min-width: 0;
  }
  /* sidebar nav은 Split 트랙 폭에 맞춰 — 고정폭 토큰 해제 */
  main[data-part="finder"] section[data-pane="sidebar"] > nav[data-part="sidebar"] {
    width: auto;
  }
  /* columns: 자기 pane 내에서만 가로 스크롤 */
  section[data-part="columns"] {
    display: flex; overflow: auto;
  }
  /* list-view: columns와 달리 자기 폭을 자연스럽게 채우되 preview와 공유.
     basis 자동 + 1단계 grow → preview의 min-width(var(--ds-preview-w))가 보장되는
     남은 공간을 ListView가 차지. 행 수가 많으면 자체 세로 스크롤. */
  section[data-part="list-view"] {
    flex: 1 1 0; min-width: 0; overflow: auto;
    display: block;
    container-type: inline-size;
    container-name: list-view;
  }
  /* 좁은 컨테이너 — 보조 컬럼(수정일/크기/종류) 숨김, 이름만. tap 친화 행 높이. */
  @container list-view (max-width: 480px) {
    section[data-part="list-view"] [role="treegrid"] colgroup col:nth-child(n+2),
    section[data-part="list-view"] [role="treegrid"] thead th:nth-child(n+2),
    section[data-part="list-view"] [role="treegrid"] tbody td:nth-child(n+2) {
      display: none;
    }
    section[data-part="list-view"] [role="treegrid"] tbody td:first-child {
      padding-block: ${pad(1.5)};
      font-size: var(--ds-text-md);
    }
  }
  section[data-part="list-view"] [role="treegrid"] {
    table-layout: fixed;
  }
  section[data-part="list-view"] col[data-col="name"]  { inline-size: auto; }
  section[data-part="list-view"] col[data-col="mtime"] { inline-size: 14rem; }
  section[data-part="list-view"] col[data-col="size"]  { inline-size: 6rem; }
  section[data-part="list-view"] col[data-col="kind"]  { inline-size: 8rem; }
  /* L1 — Columns 내부 column의 outer-layout(width)은 columns 부모가 소유. */
  section[data-part="columns"] > nav[data-part="column"] {
    width: var(--ds-column-w); flex: none; overflow-y: auto;
    border-inline-end: var(--ds-hairline) solid var(--ds-border);
  }
  /* 컬럼 내 폴더 옵션 — 우측 chevron 자동 주입 (widget-internal) */
  nav[data-part="column"] [role="option"][aria-haspopup="menu"]::after {
    ${icon('chevronRight', '0.8em')}
    margin-inline-start: auto; opacity: .4;
  }

  /* Preview widget 본체 — outer layout(min-width/flex) 결정은 부모 셸이 소유. */
  aside[data-part="preview"] {
    overflow-x: hidden; overflow-y: auto;
    display: flex; flex-direction: column; gap: ${pad(4)};
    padding: ${pad(4)};
    min-width: 0;
    container-type: inline-size;
    container-name: preview;
  }
  /* preview header — 파일/폴더 카드: figure 히어로 타일 + hgroup(이름 + 메타). */
  aside[data-part="preview"] > header {
    display: flex; flex-direction: column; gap: ${pad(2)};
    align-items: stretch;
  }
  aside[data-part="preview"] > header > figure {
    width: 100%; aspect-ratio: 4/3;
    border-radius: ${pad(2)};
    background: color-mix(in oklch, Canvas 92%, CanvasText 8%);
    display: grid; place-items: center;
    font-size: 72px; margin: 0;
  }
  aside[data-part="preview"] > header > hgroup { display: grid; gap: ${pad(0.5)}; }
  aside[data-part="preview"] > header > hgroup > p { opacity: .6; margin: 0; font-size: var(--ds-text-sm); }
  /* L1 desktop Finder layout — preview에 min-width를 부여하는 책임은 여기. */
  main[data-part="finder"] section[data-pane="preview"] > aside[data-part="preview"] {
    min-width: 0;
  }
  /* preview 컨텐츠 — 가독 폭 max + 중앙 정렬 (header/article/dl/pre 모두) */
  aside[data-part="preview"] > header,
  aside[data-part="preview"] > article,
  aside[data-part="preview"] > dl,
  aside[data-part="preview"] > pre,
  aside[data-part="preview"] > h2 {
    width: 100%;
    max-width: var(--ds-prose-w, 72ch);
    margin-inline: auto;
  }
  /* preview 내부 코드/이미지는 자기 폭 안에서 해결 — preview 자체에 가로 스크롤 금지 */
  aside[data-part="preview"] > pre,
  aside[data-part="preview"] > article pre {
    max-width: 100%; overflow-x: auto; margin: 0;
  }
  /* 좁은 preview — 코드 soft-wrap. wrap된 줄도 .line counter는 1번만 증가하므로 줄번호 정확. */
  @container preview (max-width: 600px) {
    aside[data-part="preview"] > pre,
    aside[data-part="preview"] > article pre {
      white-space: pre-wrap;
      word-break: break-word;
      overflow-wrap: anywhere;
      overflow-x: hidden;
      tab-size: 2;
    }
    aside[data-part="preview"] pre code .line::before {
      width: 2em;
      margin-inline-end: ${pad(2)};
    }
  }
  /* shiki 출력에 줄번호 부여 — <span class="line"> 카운터 */
  aside[data-part="preview"] pre code {
    counter-reset: line;
    display: block;
  }
  aside[data-part="preview"] pre code .line {
    counter-increment: line;
  }
  aside[data-part="preview"] pre code .line::before {
    content: counter(line);
    display: inline-block;
    width: 2.5em;
    margin-inline-end: ${pad(3)};
    text-align: end;
    opacity: .35;
    user-select: none;
  }
  aside[data-part="preview"] > article {
    max-width: 100%; min-width: 0;
    overflow-wrap: anywhere; word-break: break-word;
  }
  aside[data-part="preview"] img {
    max-width: 100%; height: auto;
  }
  aside[data-part="preview"] > header h2 {
    ${typography('heading')}; word-break: break-all; margin: 0;
  }
  aside[data-part="preview"] dl {
    display: grid; grid-template-columns: auto 1fr;
    row-gap: ${pad(1.5)}; column-gap: ${pad(3)}; margin: 0;
  }
  aside[data-part="preview"] dt { opacity: .55; }
  aside[data-part="preview"] dd {
    margin: 0; text-align: end;
    font-variant-numeric: tabular-nums;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
`

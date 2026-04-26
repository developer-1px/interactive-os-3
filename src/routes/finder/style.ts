import { css, pad, icon } from '../../ds/foundations'

// Finder desktop — sidebar / columns / list-view / preview.
// (sidebar surface 자체는 widgets/composite/sidebar.ts owner.)
export const finderCss = css`
  /* columns: 내용 자연 폭만 사용. 넘치면 자체 가로 스크롤. */
  section[aria-roledescription="columns"] {
    flex: 0 1 auto; display: flex; overflow: auto; min-width: 0;
  }
  /* list-view: columns와 달리 자기 폭을 자연스럽게 채우되 preview와 공유.
     basis 자동 + 1단계 grow → preview의 min-width(var(--ds-preview-w))가 보장되는
     남은 공간을 ListView가 차지. 행 수가 많으면 자체 세로 스크롤. */
  section[aria-roledescription="list-view"] {
    flex: 1 1 0; min-width: 0; overflow: auto;
    display: block;
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

  /* Preview widget 본체 — outer layout(min-width/flex) 결정은 부모 셸이 소유. */
  aside[aria-roledescription="preview"] {
    overflow-x: hidden; overflow-y: auto;
    display: flex; flex-direction: column; gap: ${pad(4)};
    padding: ${pad(4)};
    min-width: 0;
    container-type: inline-size;
    container-name: preview;
  }
  /* preview header — 파일/폴더 카드: figure 히어로 타일 + hgroup(이름 + 메타). */
  aside[aria-roledescription="preview"] > header {
    display: flex; flex-direction: column; gap: ${pad(2)};
    align-items: stretch;
  }
  aside[aria-roledescription="preview"] > header > figure {
    width: 100%; aspect-ratio: 4/3;
    border-radius: ${pad(2)};
    background: color-mix(in oklch, Canvas 92%, CanvasText 8%);
    display: grid; place-items: center;
    font-size: 72px; margin: 0;
  }
  aside[aria-roledescription="preview"] > header > hgroup { display: grid; gap: ${pad(0.5)}; }
  aside[aria-roledescription="preview"] > header > hgroup > p { opacity: .6; margin: 0; font-size: var(--ds-text-sm); }
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
  /* 좁은 preview — 코드 soft-wrap. wrap된 줄도 .line counter는 1번만 증가하므로 줄번호 정확. */
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
  aside[aria-roledescription="preview"] h2 {
    font-size: var(--ds-text-lg); font-weight: 600; word-break: break-all; margin: 0;
  }
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

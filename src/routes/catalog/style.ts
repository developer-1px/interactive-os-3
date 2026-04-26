import { css, pad, dim, microLabel, status, neutral, radius, grouping } from '../../ds/foundations'
import { SHELL_MOBILE_MAX } from '../../ds/style/preset/breakpoints'

// Catalog — ds ui zone-first 감사 대시보드.
// edu-portal-admin 과 동일한 셸 구조, content 영역은 zone(h2) → component card(h3) 위계.
export const catalogCss = css`
  /* catalog-page — definePage 단일 화면. sidebar | workspace 좌우 분리 스크롤. */
  [aria-roledescription="catalog-page"] {
    height: 100dvh; min-height: 0; overflow: hidden;
    padding: 0; gap: 0;
  }
  [aria-roledescription="catalog-page"] > main {
    overflow-y: auto; overflow-x: hidden;
    min-block-size: 0;
  }

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

  /* Catalog preview — 카드 클릭 시 우측 aside에 큰 demo + 상세. */
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
    background: ${neutral(1)};
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

  /* 카드 클릭 어포던스 + 선택 표식 */
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

  /* Catalog 모바일 — sidebar 좌측 드로어 + 카드 1라인 압축 */
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    main[aria-roledescription="catalog-app"] [aria-roledescription="nav-toggle"] {
      display: inline-flex; align-items: center; justify-content: center;
      inline-size: 2.25rem; block-size: 2.25rem;
      border: var(--ds-hairline) solid var(--ds-border); border-radius: ${radius('md')};
      background: var(--ds-bg); cursor: pointer; flex: none;
    }
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
    main[aria-roledescription="catalog-app"] > section[aria-roledescription="body"] > button[aria-roledescription="scrim"] {
      position: fixed; inset: 0; z-index: 49;
      background: color-mix(in oklch, CanvasText 35%, transparent);
      border: 0;
    }

    main[aria-roledescription="catalog-app"] header[aria-roledescription="topbar"] {
      gap: ${pad(2)};
    }
    main[aria-roledescription="catalog-app"] header[aria-roledescription="topbar"] > hgroup > p { display: none; }
    main[aria-roledescription="catalog-app"] header[aria-roledescription="topbar"] > hgroup > h1 {
      font-size: var(--ds-text-md);
    }
    main[aria-roledescription="catalog-app"] dl[aria-roledescription="catalog-stats"] { display: none; }

    section[aria-roledescription="catalog-zone"] > p { display: none; }
    section[aria-roledescription="catalog-zone"] > header > h2 { font-size: var(--ds-text-md); }

    ul[aria-roledescription="catalog-grid"] {
      grid-template-columns: 1fr;
      gap: ${pad(1)};
    }

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
`

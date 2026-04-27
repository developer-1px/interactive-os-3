import { SHELL_MOBILE_MAX, css, grouping, microLabel, radius, status, surface, text, typography } from '@p/ds/tokens/foundations'
import { weight } from '@p/ds/tokens/palette'
import { dim, neutral, pad } from '@p/ds/tokens/palette'

// Catalog — ds ui zone-first 감사 대시보드.
// edu-portal-admin 과 동일한 셸 구조, content 영역은 zone(h2) → component card(h3) 위계.
export const catalogCss = css`
  /* catalog-page — definePage 단일 화면. sidebar | workspace 좌우 분리 스크롤. */
  [data-part="catalog-page"] {
    height: 100dvh; min-height: 0; overflow: hidden;
    padding: 0; gap: 0;
  }
  [data-part="catalog-page"] > main {
    overflow-y: auto; overflow-x: hidden;
    min-block-size: 0;
  }

  main[data-part="catalog-app"] {
    height: 100vh; display: flex; flex-direction: column; overflow: hidden;
    container-type: inline-size; container-name: shell;
  }
  main[data-part="catalog-app"] > section[data-slot="body"] {
    flex: 1; display: flex; min-height: 0;
  }
  dl[data-part="catalog-stats"] {
    margin: 0; display: flex; gap: ${pad(5)}; align-items: baseline;
  }
  dl[data-part="catalog-stats"] > div { display: grid; gap: ${pad(0.25)}; }
  dl[data-part="catalog-stats"] dt {
    ${microLabel()}
    margin: 0;
  }
  dl[data-part="catalog-stats"] dd {
    margin: 0; ${typography('heading')};
    font-variant-numeric: tabular-nums;
  }
  dl[data-part="catalog-stats"] [data-tone="good"] { color: ${status('success')}; }
  dl[data-part="catalog-stats"] [data-tone="warn"] { color: ${status('warning')}; }

  section[data-part="catalog-zone"] {
    display: flex; flex-direction: column; gap: ${pad(3)};
  }
  section[data-part="catalog-zone"] > header {
    border-bottom: var(--ds-hairline) solid var(--ds-border);
    padding-bottom: ${pad(2)};
    display: flex; align-items: baseline; gap: ${pad(2)};
  }
  section[data-part="catalog-zone"] > header > h2 {
    margin: 0; ${typography('headingStrong')};
    letter-spacing: var(--ds-tracking);
  }
  section[data-part="catalog-zone"] > header > small {
    color: ${text('mute')}; font-size: var(--ds-text-sm);
    font-variant-numeric: tabular-nums;
  }
  section[data-part="catalog-zone"] > p {
    margin: 0; color: ${text('mute')}; font-size: var(--ds-text-sm); max-width: 60ch;
  }

  ul[data-part="catalog-grid"] {
    list-style: none; margin: 0; padding: 0;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: ${pad(3)};
  }

  article[data-part="catalog-card"] {
    ${grouping(1)}
    margin: 0;
    border: var(--ds-hairline) solid var(--ds-border); border-radius: ${pad(2)};
    padding: ${pad(3)};
    display: flex; flex-direction: column; gap: ${pad(2)};
    cursor: pointer;
    transition: border-color var(--ds-dur-fast) var(--ds-ease-out),
                box-shadow var(--ds-dur-fast) var(--ds-ease-out);
  }
  article[data-part="catalog-card"] > header {
    display: flex; align-items: baseline; gap: ${pad(1.5)}; flex-wrap: wrap;
  }
  article[data-part="catalog-card"] > header > h3 {
    margin: 0; ${typography('bodyStrong')};
  }
  article[data-part="catalog-card"] > header > [data-badge] {
    padding: ${pad(0.25)} ${pad(1)}; border-radius: ${radius('pill')};
    ${typography('microStrong')};
    background: color-mix(in oklch, var(--ds-fg) 8%, transparent);
  }
  article[data-part="catalog-card"] > header > [data-badge][data-tone="good"] {
    background: color-mix(in oklch, ${status('success')} 14%, transparent);
    color: ${status('success')};
  }
  article[data-part="catalog-card"] > header > [data-badge][data-tone="warn"] {
    background: color-mix(in oklch, ${status('warning')} 14%, transparent);
    color: ${status('warning')};
  }
  article[data-part="catalog-card"] > header > [data-badge][data-tone="bad"] {
    background: color-mix(in oklch, ${status('danger')} 14%, transparent);
    color: ${status('danger')};
  }
  article[data-part="catalog-card"] > header > code {
    font-size: var(--ds-text-xs); color: ${text('mute')};
    font-family: ui-monospace, monospace;
  }
  article[data-part="catalog-card"] > header > small {
    margin-inline-start: auto;
    color: ${text('mute')}; font-size: var(--ds-text-xs);
    font-variant-numeric: tabular-nums;
  }
  article[data-part="catalog-card"] > [data-part="card-path"] {
    font-family: ui-monospace, monospace;
    font-size: var(--ds-text-xs); color: ${text('mute')};
  }
  article[data-part="catalog-card"] > pre {
    margin: 0; padding: ${pad(2)};
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
    border-radius: ${pad(1)}; font-size: var(--ds-text-xs);
    overflow-x: auto; font-family: ui-monospace, monospace;
  }
  article[data-part="catalog-card"] > figure[data-part="card-demo"] {
    margin: 0; padding: ${pad(2)};
    border: 1px dashed var(--ds-border);
    border-radius: ${pad(1)};
    background: color-mix(in oklch, var(--ds-fg) 2%, transparent);
    min-height: 56px;
    display: flex; align-items: center;
  }
  article[data-part="catalog-card"] > ul[data-part="card-checks"] {
    list-style: none; padding: 0; margin: 0;
    display: grid; gap: ${pad(0.5)}; font-size: var(--ds-text-xs);
  }
  article[data-part="catalog-card"] [data-pass="true"]  { color: ${status('success')}; }
  article[data-part="catalog-card"] [data-pass="false"] { color: ${status('danger')}; }
  article[data-part="catalog-card"] > footer {
    margin: 0; color: ${text('mute')}; font-size: var(--ds-text-xs);
    border-top: var(--ds-hairline) solid var(--ds-border); padding-top: ${pad(1.5)};
  }

  /* Catalog preview — 카드 클릭 시 우측 aside에 큰 demo + 상세. */
  main[data-part="catalog-app"] > section[data-slot="body"]
    > aside[data-part="preview"] {
    display: none;
  }
  main[data-part="catalog-app"][data-preview-open="true"]
    > section[data-slot="body"]
    > aside[data-part="preview"] {
    display: flex; flex-direction: column; gap: ${pad(3)};
    flex: 0 0 var(--ds-preview-w, 480px);
    border-inline-start: var(--ds-hairline) solid var(--ds-border);
    background: ${surface('subtle')};
    padding: ${pad(4)};
    overflow-y: auto;
  }
  aside[data-part="preview"] > header {
    display: flex; align-items: flex-start; gap: ${pad(2)};
  }
  aside[data-part="preview"] > header > hgroup { flex: 1; min-width: 0; }
  aside[data-part="preview"] > header > hgroup > h2 {
    margin: 0; ${typography('headingStrong')};
  }
  aside[data-part="preview"] > header > hgroup > p {
    margin: ${pad(0.5)} 0 0;
    display: flex; gap: ${pad(1.5)}; align-items: baseline; flex-wrap: wrap;
    color: ${text('mute')}; font-size: var(--ds-text-sm);
  }
  aside[data-part="preview"] > header > hgroup > p > code {
    font-family: ui-monospace, monospace; font-size: var(--ds-text-xs);
  }
  aside[data-part="preview"] > header > button {
    inline-size: 2rem; block-size: 2rem;
    border: 0; background: transparent; color: inherit; cursor: pointer;
    font-size: 1.25rem; line-height: 1; border-radius: ${radius('md')};
  }
  aside[data-part="preview"] > header > button:hover {
    background: color-mix(in oklch, CanvasText 8%, transparent);
  }
  aside[data-part="preview"] > figure[data-part="card-demo"] {
    margin: 0; padding: ${pad(4)};
    border: 1px dashed var(--ds-border);
    border-radius: ${pad(1.5)};
    background: color-mix(in oklch, var(--ds-fg) 2%, transparent);
    min-block-size: 200px;
    display: flex; align-items: center; justify-content: center;
  }
  aside[data-part="preview"] > pre {
    margin: 0; padding: ${pad(2.5)};
    background: color-mix(in oklch, var(--ds-fg) 4%, transparent);
    border-radius: ${pad(1)}; font-size: var(--ds-text-xs);
    overflow-x: auto; font-family: ui-monospace, monospace;
  }
  aside[data-part="preview"] > ul[data-part="card-checks"] {
    list-style: none; padding: 0; margin: 0;
    display: grid; gap: ${pad(0.75)}; font-size: var(--ds-text-sm);
  }
  aside[data-part="preview"] [data-pass="true"]  { color: ${status('success')}; }
  aside[data-part="preview"] [data-pass="false"] { color: ${status('danger')}; }

  /* 카드 클릭 어포던스 + 선택 표식 */
  article[data-part="catalog-card"]:hover {
    border-color: color-mix(in oklch, var(--ds-accent) 40%, var(--ds-border));
  }
  article[data-part="catalog-card"][aria-current="true"] {
    border-color: var(--ds-accent);
    box-shadow: 0 0 0 1px var(--ds-accent);
  }

  /* 모바일 — preview는 화면 전체를 덮는 오버레이로 */
  @container shell (max-width: ${SHELL_MOBILE_MAX}) {
    main[data-part="catalog-app"][data-preview-open="true"]
      > section[data-slot="body"]
      > aside[data-part="preview"] {
      position: fixed; inset: 0; z-index: 50;
      flex: none; inline-size: 100%;
      border-inline-start: 0;
    }
  }

  /* topbar의 nav-toggle은 데스크톱에서 숨김, 모바일에서만 노출 */
  main[data-part="catalog-app"] [data-part="nav-toggle"] { display: none; }

  /* Catalog 모바일 — sidebar 좌측 드로어 + 카드 1라인 압축 */
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    main[data-part="catalog-app"] [data-part="nav-toggle"] {
      display: inline-flex; align-items: center; justify-content: center;
      inline-size: 2.25rem; block-size: 2.25rem;
      border: var(--ds-hairline) solid var(--ds-border); border-radius: ${radius('md')};
      background: var(--ds-bg); cursor: pointer; flex: none;
    }
    main[data-part="catalog-app"] > section[data-slot="body"] > nav[data-part="sidebar"] {
      position: fixed;
      inset-block: 0; inset-inline-start: 0;
      inline-size: min(80vw, 18rem);
      z-index: 50;
      transform: translateX(-100%);
      transition: transform var(--ds-dur-fast) var(--ds-ease-out);
      box-shadow: 0 0 24px color-mix(in oklch, CanvasText 12%, transparent);
    }
    main[data-part="catalog-app"][data-nav-open="true"] > section[data-slot="body"] > nav[data-part="sidebar"] {
      transform: translateX(0);
    }
    main[data-part="catalog-app"] > section[data-slot="body"] > button[data-part="scrim"] {
      position: fixed; inset: 0; z-index: 49;
      background: color-mix(in oklch, CanvasText 35%, transparent);
      border: 0;
    }

    main[data-part="catalog-app"] header[data-part="topbar"] {
      gap: ${pad(2)};
    }
    main[data-part="catalog-app"] header[data-part="topbar"] > hgroup > p { display: none; }
    main[data-part="catalog-app"] header[data-part="topbar"] > hgroup > h1 {
      font-size: var(--ds-text-md);
    }
    main[data-part="catalog-app"] dl[data-part="catalog-stats"] { display: none; }

    section[data-part="catalog-zone"] > p { display: none; }
    section[data-part="catalog-zone"] > header > h2 { font-size: var(--ds-text-md); }

    ul[data-part="catalog-grid"] {
      grid-template-columns: 1fr;
      gap: ${pad(1)};
    }

    article[data-part="catalog-card"] {
      flex-direction: row; align-items: center; gap: ${pad(1.5)};
      padding: ${pad(1.5)} ${pad(2)};
      border-radius: ${radius('md')};
      min-block-size: 0;
    }
    article[data-part="catalog-card"] > header {
      flex: 1; min-inline-size: 0; gap: ${pad(1.5)};
      flex-wrap: nowrap;
    }
    article[data-part="catalog-card"] > header > h3 {
      ${typography('captionStrong')};
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      min-inline-size: 0;
    }
    article[data-part="catalog-card"] > header > code { display: none; }
    article[data-part="catalog-card"] > header > small {
      font-size: var(--ds-text-xs); flex: none;
    }
    article[data-part="catalog-card"] > [data-part="card-path"],
    article[data-part="catalog-card"] > pre,
    article[data-part="catalog-card"] > figure[data-part="card-demo"],
    article[data-part="catalog-card"] > ul[data-part="card-checks"],
    article[data-part="catalog-card"] > footer {
      display: none;
    }
  }
`

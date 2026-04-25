import { css, pad, radius, surface } from '../../../fn/values'
import { mix } from '../../../fn/palette'
import { square } from '../../../fn/structural'

/**
 * Layout primitives (Row / Column / Grid).
 *
 * Design: docs/2026/2026-04/2026-04-24/a2ui-layout-adoption.md
 * - Classless: selectors target tag + role + aria-* only. `data-ds`는 HTML에
 *   대응 태그가 없는 Row/Column/Grid 에만 허용. 나머지 시맨틱 컨테이너는
 *   `aside`/`section`/`header`/`footer` 태그로 식별한다.
 * - Minimize choices: no numeric gap/pad/align — only semantic `flow` + `emphasis` enums
 * - `flow`    — list | cluster | form | prose | split
 * - `emphasis` — flat | raised | sunk | callout
 * - Grid has `cols` (1 | 2 | 3 | 4 | 6 | 12). No raw template escape hatch in 1-pass.
 *
 * Shell's panes.ts is appended after this generator, so pane-specific rules
 * still win over generic layout defaults when both apply to the same node.
 */
export const layout = () => css`
  /* ── roots ───────────────────────────────────────────── */
  [data-ds="Row"],
  [data-ds="Column"] { display: flex; min-inline-size: 0; }
  [data-ds="Row"]    { flex-direction: row; }
  [data-ds="Column"] { flex-direction: column; }

  /* Grid는 cols를 "넓을 때의 목표 열 수"로, --ds-grid-min을 "한 셀의 최소 폭"으로 사용.
     auto-fit + minmax(max(grid-min, 100%/cols), 1fr) → 넓으면 정확히 cols 열,
     좁아지면 grid-min 기준으로 자연 reflow. 모바일에서 1열까지 자동 수렴. */
  [data-ds="Grid"] {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(max(var(--ds-grid-min, 16rem), 100% / var(--ds-cols, 2) - 0.01px), 1fr)
    );
    min-inline-size: 0;
  }
  [data-ds="Grid"][data-cols="1"]  { --ds-cols: 1;  --ds-grid-min: 100%;  }
  [data-ds="Grid"][data-cols="2"]  { --ds-cols: 2;  --ds-grid-min: 18rem; }
  [data-ds="Grid"][data-cols="3"]  { --ds-cols: 3;  --ds-grid-min: 14rem; }
  [data-ds="Grid"][data-cols="4"]  { --ds-cols: 4;  --ds-grid-min: 12rem; }
  [data-ds="Grid"][data-cols="6"]  { --ds-cols: 6;  --ds-grid-min: 8rem;  }
  [data-ds="Grid"][data-cols="12"] { --ds-cols: 12; --ds-grid-min: 4rem;  }

  /* ── flow — one enum chooses gap + alignment bundle ───
     data-flow는 Renderer가 Row/Column/Grid/Aside/Section/Header/Footer에만 주입한다. */
  [data-flow="list"]    { gap: ${pad(1)}; align-items: stretch; }
  [data-flow="cluster"] { gap: ${pad(2)}; align-items: center; flex-wrap: wrap; }
  [data-flow="form"]    { gap: ${pad(3)}; align-items: stretch; }
  [data-flow="prose"]   { gap: ${pad(4)}; align-items: stretch; }
  [data-flow="split"]   { gap: ${pad(3)}; align-items: center; justify-content: space-between; }

  /* ── emphasis — surface + radius + padding bundle ────── */
  [data-emphasis="flat"]    { padding: ${pad(2)}; }
  [data-emphasis="raised"]  {
    ${surface(1)}
    border-radius: ${radius('md')};
    padding: ${pad(3)};
  }
  [data-emphasis="sunk"]    {
    background: ${mix('Canvas', 96, 'CanvasText')};
    border-radius: ${radius('md')};
    padding: ${pad(3)};
  }
  [data-emphasis="callout"] {
    border: 1px solid var(--ds-accent);
    border-radius: ${radius('sm')};
    padding: ${pad(3)};
  }

  /* ── FlatLayout extras ──────────────────────────────────────── */

  /* Semantic landmarks as flex containers — aria-roledescription이 있는 pane(Finder body/columns/preview 등)은 panes.ts가 직접 제어하므로 제외. */
  aside:not([aria-roledescription]),
  section:not([aria-roledescription]),
  header:not([aria-roledescription]),
  footer:not([aria-roledescription]) {
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
  }
  aside:not([aria-roledescription]) { flex: none; }
  header[data-flow="split"],
  footer[data-flow="split"] { flex-direction: row; }

  /* Item-level placement — set on the node itself (flex item). */
  [data-ds-grow="true"]  { flex: 1 1 0; min-inline-size: 0; }
  [data-ds-width]        { flex: none; } /* inline-size comes via inline style */
  [data-ds-align="start"]    { align-self: flex-start; }
  [data-ds-align="center"]   { align-self: center; }
  [data-ds-align="end"]      { align-self: flex-end; }
  [data-ds-align="stretch"]  { align-self: stretch; }

  /* aspect — width 축만 정해진 곳에 height를 비율로 도출. avatar/icon tile 등.
     square는 fn/square로 일관 처리, 그 외는 inline 비율 변수로. */
  ${square('[data-ds-aspect="square"]')}
  [data-ds-aspect]:not([data-ds-aspect="square"]) { aspect-ratio: var(--ds-aspect, 1); }

  /* Text variants — semantic tags already carry weight, these only bundle
     spacing/opacity. Renderer always attaches data-variant to Text leaves. */
  [data-variant]                 { margin: 0; }
  [data-variant="muted"]         { opacity: .65; }
  [data-variant="small"]         { opacity: .75; font-size: var(--ds-text-sm, .875em); }
`

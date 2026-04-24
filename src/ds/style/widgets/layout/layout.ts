import { css, pad, radius, surface } from '../../../fn/values'

/**
 * Layout primitives (Row / Column / Grid).
 *
 * Design: docs/2026/2026-04/2026-04-24/a2ui-layout-adoption.md
 * - Classless: all selectors target [data-ds="..."] on a <div>
 * - Minimize choices: no numeric gap/pad/align — only semantic `flow` + `emphasis` enums
 * - `flow`    — list | cluster | form | prose | split  (stack dropped for 1-pass; add back if needed)
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

  [data-ds="Grid"] {
    display: grid;
    grid-template-columns: repeat(var(--ds-cols, 2), minmax(0, 1fr));
    min-inline-size: 0;
  }
  [data-ds="Grid"][data-cols="1"]  { --ds-cols: 1;  }
  [data-ds="Grid"][data-cols="2"]  { --ds-cols: 2;  }
  [data-ds="Grid"][data-cols="3"]  { --ds-cols: 3;  }
  [data-ds="Grid"][data-cols="4"]  { --ds-cols: 4;  }
  [data-ds="Grid"][data-cols="6"]  { --ds-cols: 6;  }
  [data-ds="Grid"][data-cols="12"] { --ds-cols: 12; }

  /* ── flow — one enum chooses gap + alignment bundle ─── */
  [data-ds][data-flow="list"]    { gap: ${pad(1)}; align-items: stretch; }
  [data-ds][data-flow="cluster"] { gap: ${pad(2)}; align-items: center; flex-wrap: wrap; }
  [data-ds][data-flow="form"]    { gap: ${pad(3)}; align-items: stretch; }
  [data-ds][data-flow="prose"]   { gap: ${pad(4)}; align-items: stretch; }
  [data-ds][data-flow="split"]   { gap: ${pad(3)}; align-items: center; justify-content: space-between; }

  /* ── emphasis — surface + radius + padding bundle ────── */
  [data-ds][data-emphasis="flat"]    { padding: ${pad(2)}; }
  [data-ds][data-emphasis="raised"]  {
    ${surface(1)}
    border-radius: ${radius('md')};
    padding: ${pad(3)};
  }
  [data-ds][data-emphasis="sunk"]    {
    background: color-mix(in oklch, Canvas 96%, CanvasText 4%);
    border-radius: ${radius('md')};
    padding: ${pad(3)};
  }
  [data-ds][data-emphasis="callout"] {
    border: 1px solid var(--ds-accent);
    border-radius: ${radius('sm')};
    padding: ${pad(3)};
  }

  /* ── FlatLayout extras ──────────────────────────────────────── */

  /* Aside — flex/grid item with intrinsic width (data.width drives style). */
  [data-ds="Aside"] {
    display: flex;
    flex-direction: column;
    flex: none;
    min-inline-size: 0;
  }

  /* Semantic landmarks as flex containers so item-level grow/width works. */
  [data-ds="Section"],
  [data-ds="Header"],
  [data-ds="Footer"] {
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
  }
  [data-ds="Header"][data-flow="split"],
  [data-ds="Footer"][data-flow="split"] { flex-direction: row; }

  /* Item-level placement — set on the node itself (flex item). */
  [data-ds-grow="true"]  { flex: 1 1 0; min-inline-size: 0; }
  [data-ds-width]        { flex: none; } /* inline-size comes via inline style */
  [data-ds-align="start"]    { align-self: flex-start; }
  [data-ds-align="center"]   { align-self: center; }
  [data-ds-align="end"]      { align-self: flex-end; }
  [data-ds-align="stretch"]  { align-self: stretch; }

  /* Text variants — semantic tags already carry weight, these only bundle
     spacing/opacity so pages don't need one-off selectors. */
  [data-ds="Text"]                    { margin: 0; }
  [data-ds="Text"][data-variant="muted"] { opacity: .65; }
  [data-ds="Text"][data-variant="small"] { opacity: .75; font-size: var(--ds-text-sm, .875em); }
`

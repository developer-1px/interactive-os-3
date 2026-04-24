import { css, pad, radius, surface } from '../../../fn'

/**
 * Display widgets — Badge / LegendDot / StatCard / BarChart / Top10List.
 * Classless: [data-ds="..."] + [data-tone] attribute selectors only.
 *
 * tone → oklch(65% 0.18 hue) 일률 채도·명도, hue만 회전. 다크 모드에서도
 * currentColor 대비 자동 맞춤. alert/warning은 border까지 emphasize.
 */
export const display = () => css`
  /* ── Badge ─────────────────────────────────────────────────────── */
  [data-ds="Badge"] {
    display: inline-flex; align-items: center; gap: ${pad(0.5)};
    padding: 0 ${pad(1)};
    min-height: calc(var(--ds-text-sm) * 1.8);
    border-radius: ${radius('pill')};
    font-size: var(--ds-text-xs);
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    background: color-mix(in oklch, currentColor 12%, transparent);
    color: currentColor;
  }
  [data-ds="Badge"][data-tone="info"]    { color: oklch(55% 0.18 240); background: color-mix(in oklch, oklch(55% 0.18 240) 14%, transparent); }
  [data-ds="Badge"][data-tone="success"] { color: oklch(52% 0.16 150); background: color-mix(in oklch, oklch(52% 0.16 150) 14%, transparent); }
  [data-ds="Badge"][data-tone="warning"] { color: oklch(60% 0.18  70); background: color-mix(in oklch, oklch(60% 0.18  70) 14%, transparent); }
  [data-ds="Badge"][data-tone="danger"]  { color: oklch(55% 0.20  25); background: color-mix(in oklch, oklch(55% 0.20  25) 14%, transparent); }
  [data-ds="Badge"][data-tone="neutral"] { color: color-mix(in oklch, currentColor 70%, transparent); }

  /* ── LegendDot ─────────────────────────────────────────────────── */
  [data-ds="LegendDot"] {
    display: inline-flex; align-items: center; gap: ${pad(0.75)};
    font-size: var(--ds-text-xs);
    color: color-mix(in oklch, currentColor 70%, transparent);
  }
  [data-ds="LegendDot"]::before {
    content: ''; display: inline-block;
    inline-size: .65em; block-size: .65em;
    border-radius: 999px;
    background: currentColor;
  }
  [data-ds="LegendDot"][data-tone="info"]    { color: oklch(55% 0.18 240); }
  [data-ds="LegendDot"][data-tone="success"] { color: oklch(52% 0.16 150); }
  [data-ds="LegendDot"][data-tone="warning"] { color: oklch(60% 0.18  70); }
  [data-ds="LegendDot"][data-tone="danger"]  { color: oklch(55% 0.20  25); }

  /* ── StatCard ──────────────────────────────────────────────────── */
  [data-ds="StatCard"] {
    ${surface(1)}
    margin: 0;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto auto auto;
    row-gap: ${pad(0.5)};
    column-gap: ${pad(2)};
    padding: ${pad(3)};
    border-radius: ${radius('md')};
    min-inline-size: 0;
  }
  [data-ds="StatCard"][data-tone="alert"] {
    border: 1px solid oklch(55% 0.20 25 / 0.4);
    background: color-mix(in oklch, oklch(55% 0.20 25) 4%, Canvas);
  }
  [data-ds="StatCard"] > header {
    grid-column: 1 / -1;
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(1)};
  }
  [data-ds="StatCard"] > header > dl {
    margin: 0;
  }
  [data-ds="StatCard"] > header > dl > dt {
    display: inline-flex; align-items: center; gap: ${pad(1)};
    font-size: var(--ds-text-sm);
    color: color-mix(in oklch, currentColor 60%, transparent);
    font-weight: 500;
  }
  [data-ds="StatCard"] > header > [data-ds-icon] {
    font-size: var(--ds-text-lg);
    opacity: .7;
  }
  [data-ds="StatCard"] > [data-ds-value] {
    grid-column: 1 / -1;
    font-size: calc(var(--ds-text-xl) * 1.4);
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    line-height: 1.1;
  }
  [data-ds="StatCard"] > [data-ds-sub] {
    grid-column: 1 / -1;
    color: color-mix(in oklch, currentColor 55%, transparent);
    font-size: var(--ds-text-xs);
  }
  [data-ds="StatCard"] > [data-ds-change] {
    grid-column: 1 / -1;
    font-size: var(--ds-text-xs);
    font-weight: 500;
    color: color-mix(in oklch, currentColor 55%, transparent);
  }
  [data-ds="StatCard"] > [data-ds-change][data-dir="up"]   { color: oklch(52% 0.16 150); }
  [data-ds="StatCard"] > [data-ds-change][data-dir="down"] { color: oklch(55% 0.20  25); }

  /* ── BarChart ──────────────────────────────────────────────────── */
  [data-ds="BarChart"] {
    margin: 0;
    display: flex; flex-direction: column; gap: ${pad(2)};
  }
  [data-ds="BarChart"] > [data-ds-bars] {
    list-style: none; padding: 0; margin: 0;
    display: grid;
    grid-template-columns: auto 1fr auto;
    row-gap: ${pad(1)};
    column-gap: ${pad(2)};
  }
  [data-ds="BarChart"] > [data-ds-bars] > li {
    display: contents;
  }
  [data-ds="BarChart"] [data-ds-bar-label] {
    font-size: var(--ds-text-sm);
    color: color-mix(in oklch, currentColor 70%, transparent);
  }
  [data-ds="BarChart"] [data-ds-bar-track] {
    display: block;
    block-size: 8px; align-self: center;
    background: color-mix(in oklch, currentColor 6%, transparent);
    border-radius: 999px;
    overflow: hidden;
  }
  [data-ds="BarChart"] [data-ds-bar-fill] {
    display: block; block-size: 100%;
    background: currentColor;
    border-radius: 999px;
    transition: inline-size .3s ease;
  }
  [data-ds="BarChart"] [data-ds-bar-value] {
    font-size: var(--ds-text-xs);
    font-variant-numeric: tabular-nums;
    color: color-mix(in oklch, currentColor 60%, transparent);
    min-inline-size: 3ch; text-align: end;
  }
  [data-ds="BarChart"] > [data-ds-bars] > li[data-tone="info"]    { color: oklch(55% 0.18 240); }
  [data-ds="BarChart"] > [data-ds-bars] > li[data-tone="success"] { color: oklch(52% 0.16 150); }
  [data-ds="BarChart"] > [data-ds-bars] > li[data-tone="warning"] { color: oklch(60% 0.18  70); }
  [data-ds="BarChart"] > [data-ds-bars] > li[data-tone="danger"]  { color: oklch(55% 0.20  25); }
  [data-ds="BarChart"] > figcaption {
    font-size: var(--ds-text-xs);
    color: color-mix(in oklch, currentColor 50%, transparent);
    text-align: end;
  }

  /* ── Top10List ─────────────────────────────────────────────────── */
  [data-ds="Top10List"] {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column;
  }
  [data-ds="Top10List"] > li {
    display: grid;
    grid-template-columns: 1.75em 1fr auto;
    align-items: center;
    column-gap: ${pad(2)};
    padding: ${pad(1)} 0;
    border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
  }
  [data-ds="Top10List"] > li:last-child { border-bottom: 0; }
  [data-ds="Top10List"] [data-ds-rank] {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: var(--ds-text-sm);
    text-align: center;
    color: color-mix(in oklch, currentColor 55%, transparent);
  }
  [data-ds="Top10List"] > li:nth-child(-n+3) [data-ds-rank] {
    color: oklch(55% 0.18 240);
  }
  [data-ds="Top10List"] [data-ds-top-label] {
    min-inline-size: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  [data-ds="Top10List"] [data-ds-count] {
    font-variant-numeric: tabular-nums;
    color: color-mix(in oklch, currentColor 55%, transparent);
  }

  /* ── Panel as Section[emphasis=raised] — h2/h3 하단 구분선 ─── */
  [data-ds="Section"][data-emphasis="raised"] > :where(h2, h3):first-child {
    margin: 0 0 ${pad(2)};
    padding-bottom: ${pad(2)};
    border-bottom: 1px solid color-mix(in oklch, currentColor 8%, transparent);
    font-size: var(--ds-text-md);
    font-weight: 600;
  }
`

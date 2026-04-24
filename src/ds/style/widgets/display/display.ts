import { css, dim, mix, pad, radius, status, surface, tint } from '../../../fn'

/**
 * Display widgets — Badge / LegendDot / StatCard / BarChart / Top10List.
 * Classless: [data-ds="..."] + [data-tone] attribute selectors only.
 *
 * tone → oklch(65% 0.18 hue) 일률 채도·명도, hue만 회전. 다크 모드에서도
 * currentColor 대비 자동 맞춤. alert/warning은 border까지 emphasize.
 */
export const display = () => css`
  /* ── Badge ─────────────────────────────────────────────────────────
     Button과 구분되는 시각 계약:
     - Badge는 "읽는 라벨" — 작고(xs), pill, 낮은 명도 tint, height auto(텍스트 자체 크기)
     - Button은 "눌리는 컨트롤" — 기본 체력(29.5px), radius md, 서피스 fg(2)
     포인트: Badge는 min-height 강제 없음 → 컨트롤과 같은 라인에 있어도 명확히 작음.
     cursor: default로 비-pressable 명시 (호버 피드백 없음). */
  [data-ds="Badge"] {
    display: inline-flex; align-items: center; gap: ${pad(0.5)};
    padding: 1px ${pad(1.25)};
    border-radius: ${radius('pill')};
    font-size: var(--ds-text-xs);
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
    background: ${dim(8)};
    color: currentColor;
    cursor: default;
    user-select: none;
    vertical-align: middle;
  }
  /* info는 ds에 semantic 토큰이 없어 accent에 위임. success/warning/danger는 preset 토큰 직접 소비. */
  [data-ds="Badge"][data-tone="info"]    { color: var(--ds-accent);    background: ${tint('var(--ds-accent)', 10)}; }
  [data-ds="Badge"][data-tone="success"] { color: ${status('success')}; background: ${tint(status('success'), 10)}; }
  [data-ds="Badge"][data-tone="warning"] { color: ${status('warning')}; background: ${tint(status('warning'), 10)}; }
  [data-ds="Badge"][data-tone="danger"]  { color: ${status('danger')};  background: ${tint(status('danger'), 10)}; }
  [data-ds="Badge"][data-tone="neutral"] { color: ${dim(65)}; background: ${dim(6)}; }

  /* ── LegendDot ─────────────────────────────────────────────────── */
  [data-ds="LegendDot"] {
    display: inline-flex; align-items: center; gap: ${pad(0.75)};
    font-size: var(--ds-text-xs);
    color: ${dim(70)};
  }
  [data-ds="LegendDot"]::before {
    content: ''; display: inline-block;
    inline-size: .65em; block-size: .65em;
    border-radius: 999px;
    background: currentColor;
  }
  [data-ds="LegendDot"][data-tone="info"]    { color: var(--ds-accent); }
  [data-ds="LegendDot"][data-tone="success"] { color: ${status('success')}; }
  [data-ds="LegendDot"][data-tone="warning"] { color: ${status('warning')}; }
  [data-ds="LegendDot"][data-tone="danger"]  { color: ${status('danger')}; }

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
    border: 1px solid ${tint(status('danger'), 40)};
    background: ${mix(status('danger'), 4)};
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
    color: ${dim(60)};
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
    color: ${dim(55)};
    font-size: var(--ds-text-xs);
  }
  [data-ds="StatCard"] > [data-ds-change] {
    grid-column: 1 / -1;
    font-size: var(--ds-text-xs);
    font-weight: 500;
    color: ${dim(55)};
  }
  [data-ds="StatCard"] > [data-ds-change][data-dir="up"]   { color: ${status('success')}; }
  [data-ds="StatCard"] > [data-ds-change][data-dir="down"] { color: ${status('danger')}; }

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
    color: ${dim(70)};
  }
  [data-ds="BarChart"] [data-ds-bar-track] {
    display: block;
    block-size: 8px; align-self: center;
    background: ${dim(6)};
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
    color: ${dim(60)};
    min-inline-size: 3ch; text-align: end;
  }
  [data-ds="BarChart"] > [data-ds-bars] > li[data-tone="info"]    { color: var(--ds-accent); }
  [data-ds="BarChart"] > [data-ds-bars] > li[data-tone="success"] { color: ${status('success')}; }
  [data-ds="BarChart"] > [data-ds-bars] > li[data-tone="warning"] { color: ${status('warning')}; }
  [data-ds="BarChart"] > [data-ds-bars] > li[data-tone="danger"]  { color: ${status('danger')}; }
  [data-ds="BarChart"] > figcaption {
    font-size: var(--ds-text-xs);
    color: ${dim(50)};
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
    border-bottom: 1px solid ${dim(8)};
  }
  [data-ds="Top10List"] > li:last-child { border-bottom: 0; }
  [data-ds="Top10List"] [data-ds-rank] {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: var(--ds-text-sm);
    text-align: center;
    color: ${dim(55)};
  }
  [data-ds="Top10List"] > li:nth-child(-n+3) [data-ds-rank] {
    color: var(--ds-accent);
  }
  [data-ds="Top10List"] [data-ds-top-label] {
    min-inline-size: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  [data-ds="Top10List"] [data-ds-count] {
    font-variant-numeric: tabular-nums;
    color: ${dim(55)};
  }

  /* ── Panel as Section[emphasis=raised] — h2/h3 하단 구분선 ─── */
  [data-ds="Section"][data-emphasis="raised"] > :where(h2, h3):first-child {
    margin: 0 0 ${pad(2)};
    padding-bottom: ${pad(2)};
    border-bottom: 1px solid ${dim(8)};
    font-size: var(--ds-text-md);
    font-weight: 600;
  }
`

import { css, dim, icon, mix, on, pad, radius, status, surface, tint, toneTint } from '../../../fn'

/**
 * Display widgets — Badge / LegendDot / StatCard / BarChart / Top10List.
 * Classless: [aria-roledescription="..."] + [data-tone] attribute selectors only.
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
  mark {
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
  /* tone pair — bg/fg를 toneTint()로 한 번에 주입. contrast는 preset이 보장. */
  mark[data-tone="info"]    { ${toneTint('accent', 10)} }
  mark[data-tone="success"] { ${toneTint('success', 10)} }
  mark[data-tone="warning"] { ${toneTint('warning', 10)} }
  mark[data-tone="danger"]  { ${toneTint('danger', 10)} }
  mark[data-tone="neutral"] { color: ${dim(65)}; background: ${dim(6)}; }

  /* ── LegendDot ─────────────────────────────────────────────────── */
  .legend-dot {
    display: inline-flex; align-items: center; gap: ${pad(0.75)};
    font-size: var(--ds-text-xs);
    color: ${dim(70)};
  }
  .legend-dot::before {
    content: ''; display: inline-block;
    inline-size: .65em; block-size: .65em;
    border-radius: ${radius('pill')};
    background: currentColor;
  }
  .legend-dot[data-tone="info"]    { color: var(--ds-accent); }
  .legend-dot[data-tone="success"] { color: ${status('success')}; }
  .legend-dot[data-tone="warning"] { color: ${status('warning')}; }
  .legend-dot[data-tone="danger"]  { color: ${status('danger')}; }

  /* ── StatCard — 시맨틱: article > header(dl/dt + aside icon) + strong(value) + small(sub) + small[data-dir](change) */
  .stat-card {
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
  .stat-card[data-tone="alert"] {
    border: 1px solid ${tint(status('danger'), 40)};
    background: ${mix(status('danger'), 4)};
  }
  .stat-card > header {
    grid-column: 1 / -1;
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(1)};
  }
  .stat-card > header > dl { margin: 0; }
  .stat-card > header > dl > dt {
    display: inline-flex; align-items: center; gap: ${pad(1)};
    font-size: var(--ds-text-sm);
    color: ${dim(60)};
    font-weight: 500;
  }
  .stat-card > header > span[aria-hidden="true"] {
    font-size: var(--ds-text-lg);
    opacity: .7;
  }
  .stat-card > strong {
    grid-column: 1 / -1;
    font-size: calc(var(--ds-text-xl) * 1.4);
    font-weight: 700;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    line-height: 1.1;
  }
  /* 첫 small은 sub, 두 번째 small[data-dir]는 change */
  .stat-card > small {
    grid-column: 1 / -1;
    color: ${dim(55)};
    font-size: var(--ds-text-xs);
  }
  .stat-card > small[data-dir] {
    display: inline-flex; align-items: center; gap: ${pad(0.5)};
    font-weight: 500;
  }
  .stat-card > small[data-dir="up"]   { color: ${status('success')}; }
  .stat-card > small[data-dir="down"] { color: ${status('danger')}; }
  .stat-card > small[data-dir="up"]::before   { ${icon('trending-up',   '1em')} }
  .stat-card > small[data-dir="down"]::before { ${icon('trending-down', '1em')} }

  /* ── BarChart — figure > dl > div[data-tone] > dt(label) + dd(meter + span value) */
  .bar-chart {
    margin: 0;
    display: flex; flex-direction: column; gap: ${pad(2)};
  }
  .bar-chart > dl {
    margin: 0;
    display: grid;
    grid-template-columns: auto 1fr auto;
    row-gap: ${pad(1)};
    column-gap: ${pad(2)};
  }
  .bar-chart > dl > div { display: contents; }
  .bar-chart dt {
    font-size: var(--ds-text-sm);
    color: ${dim(70)};
  }
  .bar-chart dd {
    margin: 0;
    display: contents;
  }
  .bar-chart meter {
    appearance: none;
    -webkit-appearance: none;
    inline-size: 100%;
    block-size: 8px;
    align-self: center;
    background: ${dim(6)};
    border: 0;
    border-radius: ${radius('pill')};
    overflow: hidden;
  }
  .bar-chart meter::-webkit-meter-bar {
    background: ${dim(6)};
    border: 0;
    border-radius: ${radius('pill')};
  }
  .bar-chart meter::-webkit-meter-optimum-value,
  .bar-chart meter::-webkit-meter-suboptimum-value,
  .bar-chart meter::-webkit-meter-even-less-good-value {
    background: currentColor;
    border-radius: ${radius('pill')};
    transition: inline-size .3s ease;
  }
  .bar-chart meter::-moz-meter-bar { background: currentColor; }
  .bar-chart dd > span {
    font-size: var(--ds-text-xs);
    font-variant-numeric: tabular-nums;
    color: ${dim(60)};
    min-inline-size: 3ch; text-align: end;
  }
  .bar-chart > dl > div[data-tone="info"]    { color: var(--ds-accent); }
  .bar-chart > dl > div[data-tone="success"] { color: ${status('success')}; }
  .bar-chart > dl > div[data-tone="warning"] { color: ${status('warning')}; }
  .bar-chart > dl > div[data-tone="danger"]  { color: ${status('danger')}; }
  .bar-chart > figcaption {
    font-size: var(--ds-text-xs);
    color: ${dim(50)};
    text-align: end;
  }

  /* ── Top10List — ol + CSS counter(rank) + li > span(label) + small(count) */
  .top-10 {
    counter-reset: rank;
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column;
  }
  .top-10 > li {
    counter-increment: rank;
    display: grid;
    grid-template-columns: 1.75em 1fr auto;
    align-items: center;
    column-gap: ${pad(2)};
    padding: ${pad(1)} 0;
    border-bottom: 1px solid ${dim(8)};
  }
  .top-10 > li:last-child { border-bottom: 0; }
  .top-10 > li::before {
    content: counter(rank);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: var(--ds-text-sm);
    text-align: center;
    color: ${dim(55)};
  }
  .top-10 > li:nth-child(-n+3)::before { color: var(--ds-accent); }
  .top-10 > li > span {
    min-inline-size: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .top-10 > li > small {
    font-variant-numeric: tabular-nums;
    color: ${dim(55)};
  }

  /* ── CourseCard — article + figure(badge) + div(info) + div(side).
     시맨틱: article = 독립 단위. 좌측 figure는 aria-hidden 대형 배지.
     data-tone → badge 그라디언트 색만 분기, 카드 서피스는 톤 무관. */
  .course-card {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: ${pad(3)};
    padding: ${pad(3)};
    background: Canvas;
    border: 1px solid ${dim(8)};
    border-radius: ${radius('lg')};
    transition: box-shadow .15s ease, border-color .15s ease;
  }
  .course-card:hover {
    border-color: ${dim(15)};
    box-shadow: 0 1px 3px ${dim(6)};
  }
  /* resource list breathing — widget이 자기 outer spacing 주장.
     부모 flow가 조밀한 "list"로 지정됐어도 카드 사이 최소 호흡을 확보. */
  .course-card + .course-card { margin-block-start: ${pad(2)}; }

  /* ── RoleCard — sortable resource list item.
     button(drag) + span[aria-hidden](icon) + div(info) + div(side). */
  .role-card {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    align-items: center;
    gap: ${pad(3)};
    padding: ${pad(2)} ${pad(3)};
    background: Canvas;
    border: 1px solid ${dim(8)};
    border-radius: ${radius('md')};
    transition: box-shadow .15s ease, border-color .15s ease;
  }
  .role-card:hover {
    border-color: ${dim(15)};
    box-shadow: 0 1px 3px ${dim(6)};
  }
  .role-card + .role-card { margin-block-start: ${pad(1.5)}; }

  /* drag handle — aria-label이 "드래그"를 포함하면 ghost grip 스타일.
     role-card/sortable-list 가리지 않고 모든 drag handle에 공통 적용. */
  button[aria-label*="드래그"] {
    padding: ${pad(0.5)};
    background: transparent; border: 0;
    color: ${dim(45)};
    font-size: var(--ds-text-lg);
    line-height: 1;
    cursor: grab;
    min-block-size: 0; min-inline-size: 0;
  }
  button[aria-label*="드래그"]:hover { color: ${dim(75)}; }
  button[aria-label*="드래그"]:active { cursor: grabbing; }

  /* 장식 아이콘 — emoji 또는 lucide. aria-hidden으로 의미 차단. */
  .role-card > span[aria-hidden="true"] {
    font-size: var(--ds-text-xl);
    line-height: 1;
    inline-size: 28px;
    text-align: center;
  }

  /* 중앙 info — h3 + p */
  .role-card > div:nth-of-type(1) {
    min-inline-size: 0;
    display: flex; flex-direction: column; gap: ${pad(0.25)};
  }
  .role-card > div:nth-of-type(1) > h3 {
    margin: 0;
    font-size: var(--ds-text-md);
    font-weight: 700;
  }
  .role-card > div:nth-of-type(1) > p {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: ${dim(60)};
    line-height: 1.5;
  }

  /* 우측 side — meta(<mark>) + actions */
  .role-card > div:nth-of-type(2) {
    display: flex; align-items: center;
    gap: ${pad(2)};
    flex-shrink: 0;
  }
  .role-card > div:nth-of-type(2) > div {
    display: flex; align-items: center; gap: ${pad(1)};
  }

  /* 좌측 대형 그라디언트 뱃지 — figure 태그로 식별 */
  .course-card > figure {
    margin: 0;
    inline-size: 56px; block-size: 56px;
    border-radius: ${radius('md')};
    display: grid; place-items: center;
    font-size: var(--ds-text-sm);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: ${on('accent')};
    background: linear-gradient(135deg, var(--ds-accent), ${mix('var(--ds-accent)', 70, 'CanvasText')});
  }
  .course-card[data-tone="success"] > figure {
    color: ${on('success')};
    background: linear-gradient(135deg, ${status('success')}, ${mix(status('success'), 70, 'CanvasText')});
  }
  .course-card[data-tone="warning"] > figure {
    color: ${on('warning')};
    background: linear-gradient(135deg, ${status('warning')}, ${mix(status('warning'), 70, 'CanvasText')});
  }
  .course-card[data-tone="danger"] > figure {
    color: ${on('danger')};
    background: linear-gradient(135deg, ${status('danger')}, ${mix(status('danger'), 70, 'CanvasText')});
  }
  .course-card[data-tone="neutral"] > figure {
    background: linear-gradient(135deg, ${dim(55)}, ${dim(80)});
  }

  /* 중앙 info — h3 name + p desc. div:nth-of-type(1). */
  .course-card > div:nth-of-type(1) {
    min-inline-size: 0;
    display: flex; flex-direction: column; gap: ${pad(0.5)};
  }
  .course-card > div:nth-of-type(1) > h3 {
    margin: 0;
    font-size: var(--ds-text-md);
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .course-card > div:nth-of-type(1) > p {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: ${dim(60)};
    line-height: 1.5;
  }

  /* 우측 side — meta(<mark>) + actions + footer(<small>). div:nth-of-type(2). */
  .course-card > div:nth-of-type(2) {
    display: flex; flex-direction: column; align-items: flex-end;
    gap: ${pad(1.5)};
    flex-shrink: 0;
  }
  .course-card > div:nth-of-type(2) > div {
    display: flex; align-items: center; gap: ${pad(1)};
  }
  .course-card > div:nth-of-type(2) > small {
    font-size: var(--ds-text-xs);
    color: ${dim(55)};
  }

  /* ── Panel as Section[emphasis=raised] — h2/h3 하단 구분선 ─── */
  section[data-emphasis="raised"] > :where(h2, h3):first-child {
    margin: 0 0 ${pad(2)};
    padding-bottom: ${pad(2)};
    border-bottom: 1px solid ${dim(8)};
    font-size: var(--ds-text-md);
    font-weight: 600;
  }
`

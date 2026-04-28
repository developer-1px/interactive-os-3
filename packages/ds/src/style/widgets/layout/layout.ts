import { SHELL_MOBILE_MAX, accent, border, container, control, css, grouping, hairlineWidth, hierarchy, radius, square, status, surface, text, typography } from '../../../tokens/semantic'
import { font, elev, pad } from '../../../tokens/scalar'

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
export const cssLayout = () => css`
  /* ── roots ───────────────────────────────────────────── */
  [data-ds="Row"],
  [data-ds="Column"] { display: flex; min-inline-size: 0; }
  [data-ds="Row"]    { flex-direction: row; }
  [data-ds="Column"] { flex-direction: column; }

  /* Grid는 cols를 "넓을 때의 목표 열 수"로, --grid-min을 "한 셀의 최소 폭"으로 사용.
     auto-fit + minmax(max(grid-min, 100%/cols), 1fr) → 넓으면 정확히 cols 열,
     좁아지면 grid-min 기준으로 자연 reflow. 모바일에서 1열까지 자동 수렴. */
  [data-ds="Grid"] {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(max(var(--grid-min, 16rem), 100% / var(--grid-cols, 2) - 0.01px), 1fr)
    );
    min-inline-size: 0;
  }
  [data-ds="Grid"][data-cols="1"]  { --grid-cols: 1;  --grid-min: 100%;  }
  [data-ds="Grid"][data-cols="2"]  { --grid-cols: 2;  --grid-min: 18rem; }
  [data-ds="Grid"][data-cols="3"]  { --grid-cols: 3;  --grid-min: 14rem; }
  [data-ds="Grid"][data-cols="4"]  { --grid-cols: 4;  --grid-min: 12rem; }
  [data-ds="Grid"][data-cols="6"]  { --grid-cols: 6;  --grid-min: 8rem;  }
  [data-ds="Grid"][data-cols="9"]  { --grid-cols: 9;  --grid-min: 6rem;
    /* token canvas — auto-fit reflow ❌, 9 칸 등간격 fixed. 카드 수가 적어도 한 칸씩만 채움. */
    grid-template-columns: repeat(9, 1fr);
  }
  [data-ds="Grid"][data-cols="12"] { --grid-cols: 12; --grid-min: 4rem;  }

  /* ── flow — one enum chooses gap + alignment bundle ───
     data-flow는 Renderer가 Row/Column/Grid/Aside/Section/Header/Footer에만 주입한다. */
  [data-flow="list"]    { gap: ${pad(1)}; align-items: stretch; }
  [data-flow="cluster"] { gap: ${pad(2)}; align-items: center; flex-wrap: wrap; }
  [data-flow="form"]    { gap: ${pad(3)}; align-items: stretch; }
  [data-flow="prose"]   { gap: ${pad(4)}; align-items: stretch; }
  [data-flow="split"]   { gap: ${pad(3)}; align-items: center; justify-content: space-between; }
  /* wide — page-root 가로 폭 제약 없이 viewport 전부 사용. /tokens 같은 wide canvas 용. */
  [data-flow="wide"]    { gap: ${pad(4)}; align-items: stretch; }

  /* ── emphasis — surface + radius + padding bundle ────── */
  [data-variant="flat"]    { padding: ${pad(2)}; }
  [data-variant="raised"]  {
    ${grouping(1)}
    border-radius: ${radius('md')};
    padding: ${pad(3)};
  }
  /* mobile glass override — frosted card. desktop 외형은 위 base 가 유지. */
  @media (hover: none) and (pointer: coarse) {
    [data-variant="raised"] {
      background: color-mix(in oklch, Canvas 75%, transparent);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
              backdrop-filter: blur(24px) saturate(180%);
      border: var(--ds-hairline) solid ${border()};
      box-shadow: ${elev(2)};
    }
  }
  [data-variant="sunk"]    {
    background: ${surface('subtle')};
    border-radius: ${radius('md')};
    padding: ${pad(3)};
  }
  [data-variant="callout"] {
    border: ${hairlineWidth()} solid ${accent()};
    border-radius: ${radius('sm')};
    padding: ${pad(3)};
  }

  /* ── Page root — definePage 최상위 컨테이너에 통일 inset 부여.
     Renderer가 ROOT의 직속 children에 data-page-root를 붙인다.
     기존 emphasis padding(2/3)과 같은 스케일로 모든 페이지가 화면 가장자리에 붙지 않게.
     모바일은 좁아 가독을 위해 한 단계 축소. */
  [data-page-root]:not([data-variant]) { padding: ${pad(3)}; }
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    [data-page-root]:not([data-variant]) { padding: ${pad(2)}; }
  }

  /* ── Main content width policy — single-column page-root ────────
     Row[split] (production app shell) 은 viewport 전체를 점유.
     Main / Column 이 page-root 인 단일 컨텐츠 라우트는 *읽기 폭* 으로 제약 +
     viewport 가 더 넓으면 자동 가운데 정렬. flow 가 의도하는 컨텐츠 종류에 따라
     ladder. 외부 수렴 (Notion 680, GitHub 720, Twitter 600, Slack 480). */
  :where(main, [data-ds="Column"])[data-page-root][data-flow="form"]    { max-inline-size: ${container.list};    margin-inline: auto; }
  :where(main, [data-ds="Column"])[data-page-root][data-flow="list"]    { max-inline-size: ${container.list};    margin-inline: auto; }
  :where(main, [data-ds="Column"])[data-page-root][data-flow="prose"]   { max-inline-size: ${container.reading}; margin-inline: auto; }

  /* ── Figma-like canvas — recursive Proximity 적용
     단조 증가 (atom < surface < shell < canvas):
       atom    2px  → label ↔ stage          (intra-frame)
       surface 8px  → h2 ↔ frames row        (intra-family)
       shell  16px  → frame ↔ frame, canvas inner padding (intra-row, surface)
       64px         → family ↔ family        (inter-family, canvas 전용 큰 호흡) */
  [data-part="canvas"] {
    background: ${surface('subtle')};
    background-image:
      radial-gradient(circle, color-mix(in oklch, var(--ds-fg) 12%, transparent) 1px, transparent 1px);
    background-size: 24px 24px;
    border-radius: var(--ds-radius-lg);
    padding: ${hierarchy.shell};                    /* L5 surface inner */
    display: flex; flex-direction: column;
    gap: calc(${hierarchy.shell} * 4);              /* family ↔ family — major break */
  }
  [data-part="canvas-family"] {
    display: flex; flex-direction: column;
    gap: ${hierarchy.surface};                      /* L4 h2 ↔ frames */
  }
  [data-part="canvas-family"] > h2 {
    ${typography('heading')};
    margin: 0;
    color: var(--ds-fg);
    letter-spacing: -0.01em;
  }
  [data-part="canvas-family"] > [data-part="frames"] {
    display: flex; flex-wrap: wrap;
    gap: ${hierarchy.shell};                        /* L5 frame ↔ frame, peers */
    align-items: flex-start;
  }
  [data-part="frame"] {
    display: flex; flex-direction: column;
    gap: ${hierarchy.atom};                         /* L0 label ↔ stage */
    margin: 0;
  }
  [data-part="frame"] > [data-part="frame-label"] {
    font-size: var(--ds-text-xs);
    color: var(--ds-muted);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  /* ── Stage width — foundations/layout/container 토큰 1:1 매핑.
     stage 어휘 = 컴포넌트가 사는 *환경* 이름 (chat / feed / reading 등).
     모든 폭은 container.* 가 owner — raw px 직접 쓰지 않는다. */
  [data-stage="grid"],
  [data-stage="cell"]    { inline-size: ${container.cell};    max-inline-size: 100%; }
  [data-stage="card"]    { inline-size: ${container.card};    max-inline-size: 100%; }
  [data-stage="chat"]    { inline-size: ${container.chat};    max-inline-size: 100%; }
  [data-stage="form"]    { inline-size: ${container.form};    max-inline-size: 100%; }
  [data-stage="panel"]   { inline-size: ${container.panel};   max-inline-size: 100%; }
  [data-stage="feed"]    { inline-size: ${container.feed};    max-inline-size: 100%; }
  [data-stage="reading"] { inline-size: ${container.reading}; max-inline-size: 100%; }
  [data-stage="list"]    { inline-size: ${container.list};    max-inline-size: 100%; }

  /* ── FlatLayout extras ──────────────────────────────────────── */

  /* Semantic landmarks as flex containers — data-part이 있는 pane(Finder body/columns/preview 등)은 panes.ts가 직접 제어하므로 제외. */
  main:not([data-part]),
  aside:not([data-part]),
  section:not([data-part]),
  header:not([data-part]),
  footer:not([data-part]) {
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
  }
  aside:not([data-part]) {
    flex: none;
    background: ${surface('subtle')};
    border: ${hairlineWidth()} solid ${control('border')};
    border-inline-start: 3px solid ${accent()};
    border-radius: ${radius('lg')};
    padding: ${pad(4)};
    gap: ${pad(3)};
  }
  /* aside 내부 본문 리스트 — Text[body] 안에 와도 읽기 리듬 유지 */
  aside:not([data-part]) :where(ul, ol) {
    margin: 0; padding-inline-start: ${pad(4)};
    display: flex; flex-direction: column; gap: ${pad(1.5)};
  }
  aside:not([data-part]) :where(li) { line-height: 1.55; }
  /* dl 형태의 미니 stats — dl > div 그룹, 가로 배치 */
  aside:not([data-part]) :where(dl) {
    margin: 0;
    display: flex; flex-direction: column; gap: ${pad(1)};
  }
  aside:not([data-part]) :where(dl) > div {
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(2)};
  }
  aside:not([data-part]) :where(dl) :where(dt, dd) {
    margin: 0;
    font-size: ${font('sm')};
  }
  aside:not([data-part]) :where(dl) :where(dd) {
    color: ${text('subtle')};
    font-variant-numeric: tabular-nums;
  }
  aside:not([data-part]) > section { gap: ${pad(2)}; }
  aside:not([data-part]) > section + section {
    padding-top: ${pad(3)};
    border-top: ${hairlineWidth()} solid ${control('border')};
  }
  aside:not([data-part]) > section[data-part="danger"] > h3:first-child {
    color: ${status('danger')};
  }
  header[data-flow="split"],
  footer[data-flow="split"] { flex-direction: row; }

  /* Item-level placement — set on the node itself (flex item). */
  [data-ds-grow="true"]  { flex: 1 1 0; min-inline-size: 0; }
  [data-ds-width]        { flex: none; } /* inline-size comes via inline style */
  /* maxWidth — 부모가 더 넓으면 자동 가운데 정렬. 폭 상한은 inline style.maxInlineSize. */
  [data-ds-narrow]       { inline-size: 100%; margin-inline: auto; box-sizing: border-box; }
  [data-ds-align="start"]    { align-self: flex-start; }
  [data-ds-align="center"]   { align-self: center; }
  [data-ds-align="end"]      { align-self: flex-end; }
  [data-ds-align="stretch"]  { align-self: stretch; }

  /* Container 자식 정렬 — flex/grid 어디든 동일 어휘. safe 키워드로
     콘텐츠가 컨테이너보다 클 때는 자동 start fallback → 자연 스크롤 유지. */
  [data-ds-place="center"]  { place-content: safe center; place-items: safe center; }
  [data-ds-place="start"]   { place-content: safe start;  place-items: safe start; }
  [data-ds-place="end"]     { place-content: safe end;    place-items: safe end; }
  [data-ds-place="stretch"] { place-content: stretch; place-items: stretch; }

  /* aspect — width 축만 정해진 곳에 height를 비율로 도출. avatar/icon tile 등.
     square는 fn/square로 일관 처리, 그 외는 inline 비율 변수로. */
  ${square('[data-ds-aspect="square"]')}
  [data-ds-aspect]:not([data-ds-aspect="square"]) { aspect-ratio: var(--aspect, 1); }

  /* Text variants — semantic tags already carry weight, these only bundle
     spacing/opacity. Renderer always attaches data-variant to Text leaves. */
  [data-variant]                 { margin: 0; }
  [data-variant="muted"]         { opacity: .65; }
  [data-variant="small"]         { opacity: .75; font-size: var(--ds-text-sm, .875em); }
`

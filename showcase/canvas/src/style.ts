import { css, radius, pair, bg, text, surface, border, mute, typography, type as typeRole } from '@p/ds/tokens/foundations'
import { weight, pad, font, elev } from '@p/ds/tokens/palette'
import { TONE } from './canvas-tones'
import { previewCss } from './preview/preview.style'

/**
 * Canvas — 자산 SSOT viewer. data-part 네임스페이스로 셀렉터 캡슐화.
 *
 *   canvas-app          크림 배경, fixed inset 0 (zoom-pan viewport)
 *   canvas-board        포스터 본문 (board 폭 결정)
 *   canvas-header       타이틀 + 메타
 *   canvas-{palette,semantic,atoms,composed}-column  L0/L1/L2/L3 시퀀스 컬럼
 *   canvas-section      흰 frame + soft shadow + 좌상단 검은 태그
 *   canvas-section-tag  검은 floating 태그 라벨 (Figma section 톤)
 *   canvas-subgroup     섹션 내부 file별 sub-그룹
 *   canvas-grid-color   color/icon 4열
 *   canvas-grid-value   value/recipe 3열
 *   canvas-grid-comp    컴포넌트 auto-fill 280
 *   canvas-token-card   토큰 카드 (figure)
 *   canvas-comp-card    컴포넌트 카드 (figure)
 */
export const canvasCss = css`
  [data-part="canvas-app"] {
    position: fixed; inset: 0;
    /* surface owner — bg/fg 페어로 선언. 자식은 inherit, 자체 pair 필요 시 재선언. */
    ${pair({ bg: surface('muted'), fg: text('strong') })}
    ${typography('body')}
    font-family: system-ui, sans-serif;
  }

  [data-part="canvas-board"] {
    width: max-content;
    min-width: 100vw;
    padding: 64px 80px 96px;
  }

  /* ── Atlas-style numbered TOC — 인라인 가로 jump anchors.
     mono · subtle · wrap. 각 anchor 는 num + label 한 묶음. */
  [data-part="canvas-toc"] {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: ${pad(1)} ${pad(2)};
    margin-bottom: ${pad(10)};
    padding: ${pad(2)} ${pad(3)};
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('sm')};
    background: ${surface('muted')};
    ${typography('monoMicro')}
    color: ${text('subtle')};
  }
  [data-part="canvas-toc-item"] {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    padding: 3px ${pad(1)};
    border-radius: 3px;
    color: inherit;
    text-decoration: none;
    transition: background-color 120ms ease, color 120ms ease;
  }
  [data-part="canvas-toc-item"]:hover {
    background: color-mix(in oklab, currentColor 6%, transparent);
    color: ${text('strong')};
  }
  [data-part="canvas-toc-item"] > [data-num] {
    color: ${text('subtle')};
    font-weight: ${weight('regular')};
  }

  /* SectionFrame anchor target — TOC 점프 시 hero/toc 가 frame 을 가리지 않게. */
  [data-part="canvas-section"][id] {
    scroll-margin-top: ${pad(6)};
  }

  /* ── Atlas Color frame — sub-section 세로 stack (Brand·Neutrals·Text·Borders·Status).
     출처: docs/inbox/screens-foundation.jsx ColorScreen.
     관련 swatch 들은 그룹 안에서 가로 배치, 그룹들은 세로로 적층.
     gap = pad(5) 로 통일 — Atlas section gap 톤. */
  [data-part="canvas-color-frame"],
  [data-part="canvas-divider-frame"] {
    display: flex;
    flex-direction: column;
    gap: ${pad(5)};
  }
  [data-part="canvas-color-frame"] > [data-part="canvas-subgroup"],
  [data-part="canvas-divider-frame"] > [data-part="canvas-subgroup"] {
    margin-bottom: 0;
    width: max-content;
  }
  /* Atlas color-grid — swatch 가로 row. swatch = 160px 정사각 (elev surface 와 평행).
     auto-fill 은 max-content 부모에서 1열로 collapse — flex row 가 정본.
     color-frame 외에도 divider-frame 등에서 동일 행동. */
  [data-part="canvas-color-grid"] {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${pad(4)};
  }
  [data-part="canvas-color-grid"] > [data-part="canvas-token-card"] {
    inline-size: 160px;
  }

  /* ── Atlas Divider frame — Border weights · In context · Horizontal rule.
     출처: docs/inbox/app.jsx DividerFrame.
     In-context 카드 폭은 swatch 와 동일 (160px) — 시각 평행 invariant. */
  [data-part="canvas-divider-context"] {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${pad(4)};
  }
  [data-part="canvas-divider-card"] {
    box-sizing: border-box;
    inline-size: 160px;
    padding: ${pad(3)};
    border-radius: ${radius('md')};
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('subtle')};
    background: ${bg()};
  }
  [data-part="canvas-divider-card"] code {
    font-size: ${font('xs')};
  }
  [data-part="canvas-divider-hr"] {
    border: 0;
    block-size: 1px;
    inline-size: 480px;
    background: ${border('default')};
    margin: 0;
  }

  /* ── Atlas Border Radius frame — 4 cell. 각 cell 은 elev(1) shadow 카드 형태. */
  [data-part="canvas-radius-frame"] {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${pad(4)};
  }
  [data-part="canvas-radius-cell"] {
    margin: 0;
    display: grid;
    grid-template-rows: 160px auto auto;
    row-gap: ${pad(1)};
  }
  [data-part="canvas-radius-cell"] > [data-card] {
    inline-size: 160px;
    block-size: 160px;
    box-sizing: border-box;
    border: 1px solid ${border('subtle')};
  }
  [data-part="canvas-radius-cell"] > [data-name] {
    ${typography('monoLabel')}
    color: ${text('strong')};
    text-align: center;
  }
  [data-part="canvas-radius-cell"] > [data-call] {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('subtle')};
    text-align: center;
  }

  /* ── Indicators grid — data-icon 정본 토큰 전수 (Atlas Iconography 대응).
     compact cell — 92px (다른 token preview 의 160px 보다 조밀). */
  [data-part="canvas-indicator-grid"] {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${pad(2)};
    inline-size: 1200px;
  }
  /* TokenPreview frame override — indicator 만 compact */
  [data-part="canvas-indicator-grid"] [data-part="canvas-preview"][data-kind="icon"] {
    inline-size: 92px;
    grid-template-rows: 56px auto;
  }
  [data-part="canvas-indicator-grid"] [data-part="canvas-preview"][data-kind="icon"] > [data-stage] {
    block-size: 56px;
  }
  [data-part="canvas-indicator-cell"] {
    margin: 0;
    display: grid;
    grid-template-rows: 48px auto;
    row-gap: ${pad(1)};
    place-items: center;
    padding: ${pad(2)};
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('sm')};
  }
  [data-part="canvas-indicator-cell"] > [data-glyph] {
    inline-size: 24px;
    block-size: 24px;
    color: ${text('strong')};
    align-self: center;
  }
  [data-part="canvas-indicator-cell"] > [data-name] {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('subtle')};
    text-align: center;
    word-break: break-all;
    line-height: 1.2;
  }
  /* Atlas-style frame-num — section-tag 좌측 mono 번호. accent bar 보다 앞. */
  [data-part="canvas-section-tag"] > [data-num] {
    grid-column: 1;
    grid-row: 1;
    ${typography('monoMicro')}
    font-weight: ${weight('regular')};
    color: ${text('subtle')};
    align-self: baseline;
    letter-spacing: 0.04em;
  }

  /* ── LayerPage — 개별 레이어 flat 페이지 (줌팬 ❌, fixed ❌) ─────────────────
     헤더는 자식 section 의 ColumnBanner 가 담당. LayerPage 는 padding/배경 wrapper. */
  [data-part="canvas-layer-page"] {
    ${pair({ bg: surface('subtle'), fg: text('strong') })}
    ${typography('body')}
    font-family: system-ui, sans-serif;
    min-height: 100vh;
    padding: ${pad(12)} ${pad(8)} ${pad(16)};
    box-sizing: border-box;
  }
  /* 개별 페이지에서는 column 의 fixed 폭 floor 를 무시하고 컨텐츠 따라가기. */
  [data-part="canvas-layer-page"] > [data-part$="-column"][data-part^="canvas-"] {
    min-width: auto;
    background: transparent;
    padding: 0;
    border-radius: 0;
  }

  [data-part="canvas-header"] {
    margin-bottom: ${pad(8)};
  }

  /* Essentials column — L 시리즈 골격 그대로 (ColumnBanner + SectionFrame).
     별도 layout CSS 없음 — column 셀렉터에 자동 매칭. L 시리즈와 같은 폭 floor. */
  [data-part="canvas-essentials-column"] {
    min-width: 1300px;
    width: max-content;
    gap: ${pad(14)};
  }
  [data-part="canvas-header"] > [data-meta] {
    ${typography('monoMicro')}
    letter-spacing: 0.18em;
    text-transform: uppercase;
    ${mute(2)}
    margin-bottom: ${pad(2)};
  }
  [data-part="canvas-header"] > h1 {
    ${typography('hero')}
    font-size: calc(${font('3xl')} * 1.6);
    letter-spacing: -0.03em;
    line-height: 1;
    margin: 0 0 ${pad(2)};
  }
  [data-part="canvas-header"] > [data-stats] {
    ${typography('body')}
    ${mute(1)}
  }
  [data-part="canvas-header"] code {
    ${typography('mono')}
  }

  /* 3 레이어 가로 배치 — L0 Palette · L1 Semantic · L2 Components.
     CSS Grid + max-content 트랙 — flex 의 손자→손주 max-content 전파 collapse 회피 (W3C css-grid-1 §6.6).
     레이어 사이만 가로, 레이어 안 컨텐츠는 세로 stack. */
  /* ZoomPanCanvas 의 absolute stage 안에서는 max-content/fit-content/intrinsic sizing 이
     중첩 flex/grid 통해 collapse 되는 spec 모호 영역. → explicit width 로 자유도 차단. */
  [data-part="canvas-layers"] {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: ${pad(16)};
  }
  /* 컬럼 = 한 tier 의 모든 섹션. 컬럼 사이 디바이더는 *그려진 룰이 아니라*
     1-2% column-tinted 배경 (Figma audit board) + 큰 whitespace.
     density gradient: L0 dense → L5 spacious (gap 자체가 컬럼 신호). */
  [data-part$="-column"][data-part^="canvas-"] {
    --tone: ${TONE.neutral};
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    padding: ${pad(8)};
    background: color-mix(in oklab, var(--tone) 5%, transparent);
    border-radius: ${radius('md')};
  }
  [data-part$="-column"][data-variant="info"]    { --tone: ${TONE.blue}; }
  [data-part$="-column"][data-variant="success"]   { --tone: ${TONE.green}; }
  [data-part$="-column"][data-variant="warning"]   { --tone: ${TONE.amber}; }

  /* tier 별 min 폭 + density gradient (L0 dense → L5 spacious).
     min-width 만 — 콘텐츠가 더 크면 컬럼이 따라 자란다 (max-content). 잘림·overflow ❌. */
  [data-part="canvas-palette-column"]      { min-width: 2200px; width: max-content; gap: ${pad(14)}; }
  [data-part="canvas-semantic-column"]     { min-width: 1300px; width: max-content; gap: ${pad(14)}; }
  [data-part="canvas-empty-column"]        { min-width: 720px;  width: max-content; gap: ${pad(16)}; }
  [data-part="canvas-bucket-l2-column"]    { min-width: 1400px; width: max-content; gap: ${pad(18)}; }
  [data-part="canvas-bucket-l3-column"]    { min-width: 1600px; width: max-content; gap: ${pad(20)}; }
  [data-part="canvas-bucket-l4-column"]    { min-width: 1200px; width: max-content; gap: ${pad(22)}; }
  [data-part="canvas-bucket-l5-column"]    { min-width: 1100px; width: max-content; gap: ${pad(24)}; }
  /* Section 은 자기 콘텐츠 max-content 따라감 — 컬럼 min-width 가 floor. */
  [data-part="canvas-palette-column"] [data-part="canvas-section"],
  [data-part="canvas-semantic-column"] [data-part="canvas-section"],
  [data-part="canvas-atoms-column"] [data-part="canvas-section"],
  [data-part="canvas-composed-column"] [data-part="canvas-section"] {
    box-sizing: border-box;
  }
  [data-part="canvas-components-page"] {
    border-right: none;
    padding-right: 0;
  }
  [data-part="canvas-palette-groups"] {
    display: flex;
    flex-direction: column;
    gap: ${pad(8)};
  }
  /* ── ColumnBanner — L0/L1/L2/L3 컬럼 헤더 (de facto: M3·Carbon·Polaris).
     typography-only: tier 배지 + 강한 명사 + tinted underline. 거대 숫자 ❌. */
  [data-part="canvas-column-banner"] {
    --tone: ${TONE.neutral};
    display: flex;
    flex-direction: column;
    gap: ${pad(2)};
    padding-bottom: ${pad(4)};
    margin-bottom: ${pad(6)};
  }
  [data-part="canvas-column-banner"][data-variant="info"]   { --tone: ${TONE.blue}; }
  [data-part="canvas-column-banner"][data-variant="success"]  { --tone: ${TONE.green}; }
  [data-part="canvas-column-banner"][data-variant="warning"]  { --tone: ${TONE.amber}; }

  [data-part="canvas-column-banner-eyebrow"] {
    display: inline-flex;
    align-items: center;
    gap: ${pad(2)};
  }
  /* tier 배지 = surface owner. 자체 pair (bg=tone, fg=항상 light) — 다크/라이트 무관 */
  [data-part="canvas-column-banner-tier"] {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 28px;
    padding: 3px ${pad(1.5)};
    ${pair({ bg: 'var(--tone)', fg: 'white' })}
    ${typography('monoMicro')}
    font-weight: ${weight('bold')};
    letter-spacing: 0.06em;
    border-radius: ${radius('sm')};
  }
  [data-part="canvas-column-banner-title"] {
    ${typography('hero')}
    font-weight: ${weight('extrabold')};
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0;
  }
  [data-part="canvas-column-banner-hint"] {
    ${typography('body')}
    ${mute(1)}
    line-height: 1.55;
    margin: 0;
    max-width: 56ch;
  }
  [data-part="canvas-column-banner-rule"] {
    height: 2px;
    background: var(--tone);
    border-radius: 1px;
    margin-top: ${pad(2)};
  }
  /* canvas 안 ThemeCreator 의 preview 패널은 Palette 섹션 카드와 중복이므로 숨김.
     ThemeCreator 가 자체 inline <style> 로 unlayered 룰을 박아놔서 @layer apps 보다 우선.
     specificity + !important 로 덮어씀 — canvas 안에서만 적용 (다른 라우트는 그대로). */
  [data-part="canvas-palette-column"] [data-part="theme-creator"] [aria-label="Theme preview"] {
    display: none !important;
  }
  [data-part="canvas-palette-column"] [data-part="theme-creator"] header > h1 {
    font-family: ${typeRole.mono.fontFamily} !important;
    font-size: ${font('sm')} !important;
    font-weight: ${weight('semibold')} !important;
    opacity: 0.65 !important;
    margin: 0 !important;
  }

  /* ── Section (ledger row) — Spectrum·Primer 패턴.
     L gutter (~240px) 에 헤더 sticky · R area 에 그리드. 단일 hairline + 큰 공백.
     tone 은 부모 column 에서 CSS 상속. */
  [data-part="canvas-section"] {
    display: grid;
    grid-template-columns: 240px max-content;
    column-gap: ${pad(8)};
    width: max-content;
    box-sizing: border-box;
    padding-top: ${pad(6)};
    border-top: 1px solid ${border('subtle')};
    /* perf — section 단위로도 off-screen skip. card 와 이중 보장 */
    content-visibility: auto;
    contain-intrinsic-size: 1200px 800px;
  }
  [data-part="canvas-section"]:first-child { border-top: none; padding-top: 0; }

  /* L gutter — 섹션 헤더 sticky (긴 그리드 스크롤 시 라벨 유지). col 1 고정. */
  [data-part="canvas-section-header"] {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: sticky;
    top: ${pad(4)};
    align-self: start;
    grid-column: 1;
    grid-row: 1;
  }
  /* SubGroup·grid·기타 자식은 모두 col 2 로 — auto-flow 가 col 1↔2 alternate 하는 것 차단. */
  [data-part="canvas-section"] > :not([data-part="canvas-section-header"]) {
    grid-column: 2;
  }

  /* section tag — column-tinted accent bar(4px) 옆 제목. fg 는 column 에서 inherit. */
  [data-part="canvas-section-tag"] {
    ${typography('display')}
    letter-spacing: -0.018em;
    line-height: 1.1;
    display: grid;
    /* num · marker · title · count — Atlas 스타일 num 옵션 슬롯이 column 1. */
    grid-template-columns: auto 3px 1fr auto;
    column-gap: ${pad(2.5)};
    align-items: baseline;
    background: transparent;
    padding: 0;
    margin: 0;
    text-transform: none;
  }
  [data-part="canvas-section-tag"] > [data-marker] {
    grid-column: 2;
    grid-row: 1 / -1;
    align-self: stretch;
    width: 3px;
    background: var(--tone, ${TONE.neutral});
    border-radius: 2px;
    transform: none;
  }
  [data-part="canvas-section-tag"] > [data-title] {
    grid-column: 3;
    grid-row: 1;
    font-weight: ${weight('bold')};
  }
  /* count chip — title 우측 pill 배지. "× 3" 패턴(× 접두사 + mono 숫자)으로 "개수" 어포던스 명시.
     industry: GitHub Counter · Polaris Badge · M3 Counter 수렴. 단독 숫자(typo 처럼 보임) ❌. */
  [data-part="canvas-section-tag"] > [data-count] {
    grid-column: 4;
    grid-row: 1;
    align-self: center;
    display: inline-flex;
    align-items: center;
    padding: 2px ${pad(1.5)};
    ${typography('monoMicro')}
    font-weight: ${weight('semibold')};
    line-height: 1;
    color: ${text('subtle')};
    background: ${surface('muted')};
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('pill')};
  }
  [data-part="canvas-section-tag"] > [data-count]::before {
    content: '×';
    margin-inline-end: 4px;
    color: ${text('weak')};
    font-weight: ${weight('regular')};
  }
  [data-part="canvas-section-tag"] > [data-subtitle] {
    font-family: ${typeRole.mono.fontFamily};
    font-size: ${font('xs')};
    font-weight: ${weight('regular')};
    opacity: 0.65;
    text-transform: none;
    grid-column: 3 / 5;
    grid-row: 2;
  }
  [data-part="canvas-section-standard"] {
    font-family: ${typeRole.mono.fontFamily};
    font-size: ${font('xs')};
    font-weight: ${weight('regular')};
    letter-spacing: 0.02em;
    opacity: 0.65;
    padding-left: calc(3px + ${pad(2.5)}); /* accent bar 정렬 */
    line-height: 1.5;
  }

  [data-part="canvas-shape-group"] {
    display: flex;
    flex-direction: column;
    gap: ${pad(2)};
    margin-bottom: ${pad(5)};
  }
  [data-part="canvas-shape-group"]:last-child { margin-bottom: 0; }
  [data-part="canvas-shape-label"] {
    font-family: ${typeRole.mono.fontFamily};
    font-size: ${font('xs')};
    font-weight: ${weight('regular')};
    opacity: 0.65;
    letter-spacing: 0;
  }

  [data-part="canvas-subgroup"] { margin-bottom: ${pad(6)}; width: max-content; }
  [data-part="canvas-subgroup"]:last-child { margin-bottom: 0; }
  /* subgroup eyebrow — 섹션 디바이더와 경쟁 ❌. dashed 라인 폐기, micro mono 라벨만 */
  [data-part="canvas-subgroup"] > h3,
  [data-part="canvas-subgroup"] > h4 {
    ${typography('monoMicro')}
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0.65;
    margin: 0 0 ${pad(3)};
    padding: 0;
    border: 0;
  }

  /* cols = ceil(√N) (인라인 --cols로 주입) → 각 grid가 정사각 비율.
     subgrid로 카드 row 정렬 + min-width로 카드 시각 사이즈 보장. */
  /* 토큰/카드 grid — minmax 의 max 를 고정값으로 cap. max-content 로 두면 긴 호출식 한 줄이
     컬럼 전체를 잡아당겨 카드 폭이 균일하지 않게 부풀어 오른다. break-all 로 텍스트 자체는 wrap. */
  [data-part="canvas-grid-color"] {
    display: grid;
    grid-template-columns: repeat(var(--cols, 4), minmax(110px, 160px));
    grid-auto-rows: auto;
    column-gap: ${pad(4)};
    row-gap: ${pad(4)};
    width: max-content;
  }
  [data-part="canvas-grid-value"] {
    display: grid;
    grid-template-columns: repeat(var(--cols, 3), minmax(132px, 200px));
    grid-auto-rows: auto;
    column-gap: ${pad(4)};
    row-gap: ${pad(4)};
    width: max-content;
  }
  /* 행 단위 baseline 정렬 — subgrid 로 stage/caption 두 트랙을 row 마다 맞춘다.
     선 없는 격자감: 같은 row 카드들의 stage 가 같은 높이, caption baseline 일치 → 그리드가 "느껴지되 보이지 않게". */
  /* bordered-card grid — 각 카드가 독립 bordered box, gap 으로 분리.
     같은 행 카드의 stage 는 subgrid 로 동일 높이 유지. */
  [data-part="canvas-grid-comp"] {
    display: grid;
    grid-template-columns: repeat(var(--cols, 3), minmax(280px, 360px));
    grid-auto-rows: minmax(140px, max-content) max-content;
    column-gap: ${pad(4)};
    row-gap: ${pad(4)};
    width: max-content;
  }
  /* row-list 프레임 (type-stack · token-table) — bordered frame 안 row 리스트.
     comp-card 와 같은 frame 어휘 통일. typography·value-primary 토큰 모두 사용. */
  [data-part="canvas-type-stack"],
  [data-part="canvas-token-table"] {
    display: flex; flex-direction: column;
    width: max-content;
    min-width: 480px;
    border: 1px solid ${border()};
    border-radius: ${radius('md')};
    ${pair({ bg: bg(), fg: text('strong') })}
    overflow: hidden;
  }

  /* token-card = comp-card 와 동일 frame 패턴 (occam 수렴):
     외곽 bordered card on muted page · base bg · 시각 영역은 외곽 위임 (자체 border ❌) ·
     식별자는 subtle caption (name + call 2줄). */
  [data-part="canvas-token-card"] {
    margin: 0;
    display: grid;
    grid-template-rows: auto auto;
    row-gap: 0;
    align-content: start;
    border: 1px solid ${border()};
    border-radius: ${radius('md')};
    ${pair({ bg: bg(), fg: text('strong') })}
    overflow: hidden;
  }
  [data-part="canvas-token-card"] > [data-swatch],
  [data-part="canvas-token-card"] > [data-sample],
  [data-part="canvas-token-card"] > [data-frame] {
    width: 100%;
    min-height: 80px;
    box-sizing: border-box;
    align-self: stretch;
  }
  [data-part="canvas-token-card"] > [data-swatch] {
    aspect-ratio: 1 / 1;
  }
  [data-part="canvas-token-card"] > [data-sample] {
    display: grid; place-items: center;
    padding: ${pad(3)};
  }
  [data-part="canvas-token-card"] > [data-frame] {
    display: grid; place-items: center;
    padding: ${pad(3)};
  }
  /* caption block — name 우선, call 보조. 둘 다 mono · text('subtle'/'weak') 약화. */
  [data-part="canvas-token-card"] > [data-name] {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('subtle')};
    padding: ${pad(1)} ${pad(2)} 0;
    text-align: center;
    line-height: 1.3;
  }
  [data-part="canvas-token-card"] > [data-call] {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('weak')};
    padding: 0 ${pad(2)} ${pad(1.5)};
    text-align: center;
    word-break: break-all;
    line-height: 1.4;
  }

  /* ── Color ramp — Radix · Tailwind · Carbon 수렴 디팩토. ──
     9개 카드 ❌ → flush strip + step 라벨 + hover hex.
     자동 대비: data-dark(scale ≥5) → 흰 텍스트, 미만 → 검정. */
  [data-part="canvas-color-ramp"] {
    display: flex;
    flex-direction: column;
    gap: ${pad(2)};
    width: max-content;
  }
  [data-part="canvas-color-ramp"] > [data-tiles] {
    display: flex;
    flex-direction: row;
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('sm')};
    overflow: hidden;
    isolation: isolate;
  }
  [data-part="canvas-color-ramp"] [data-tile] {
    position: relative;
    inline-size: 88px;
    block-size: 96px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: ${pad(2)};
    box-sizing: border-box;
    transition: transform 160ms ease, z-index 0s 160ms;
    cursor: default;
  }
  /* tile 은 자기 bg 위에 자기 fg — 검정 위 흰 텍스트, 흰 위 검정 텍스트 */
  [data-part="canvas-color-ramp"] [data-tile]            { color: black; }
  [data-part="canvas-color-ramp"] [data-tile][data-dark] { color: white; }
  [data-part="canvas-color-ramp"] [data-tile]:hover {
    transform: translateY(-2px);
    z-index: 1;
    transition: transform 160ms ease, z-index 0s 0s;
    box-shadow: 0 6px 16px color-mix(in oklab, CanvasText 18%, transparent);
  }
  [data-part="canvas-color-ramp"] [data-tile] > [data-step] {
    ${typography('monoStrong')}
    letter-spacing: 0.04em;
    align-self: flex-start;
  }
  [data-part="canvas-color-ramp"] [data-tile] > [data-hex] {
    font-family: ${typeRole.mono.fontFamily};
    font-size: ${font('xs')};
    font-weight: ${weight('medium')};
    letter-spacing: 0.02em;
    opacity: 0;
    transition: opacity 120ms ease;
    text-transform: lowercase;
  }
  [data-part="canvas-color-ramp"] [data-tile]:hover > [data-hex] { opacity: 0.9; }
  [data-part="canvas-color-ramp"] > [data-meta] {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: ${pad(3)};
    padding: 0 2px;
  }
  [data-part="canvas-color-ramp"] > [data-meta] > [data-name] {
    ${typography('monoLabel')}
  }
  [data-part="canvas-color-ramp"] > [data-meta] > [data-range] {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('weak')};
  }

  /* ── Spacing — 3열 [라벨 · 막대 · 값] 단순화.  Linear/Vercel 패턴.
     얇은 막대(6px)가 토큰 본체, 라벨·값은 mono 보조. opacity 누적 ❌, semantic 색만. */
  [data-part="canvas-space-stack"] {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    column-gap: ${pad(3)};
    row-gap: ${pad(1.5)};
    align-items: center;
    width: max-content;
    min-width: 320px;
  }
  [data-part="canvas-space-stack"] > [data-row] {
    display: contents;
  }
  [data-part="canvas-space-stack"] [data-label] {
    ${typography('mono')}
    color: ${text('strong')};
  }
  [data-part="canvas-space-stack"] [data-bar] {
    block-size: 6px;
    background: ${text('strong')};
    border-radius: ${radius('pill')};
    min-inline-size: 1px;
  }
  [data-part="canvas-space-stack"] [data-value] {
    ${typography('mono')}
    color: ${text('weak')};
    text-align: end;
  }

  /* ── Elevation tower — Material 3 surface tonal elevation 수렴. ──
     같은 stage 위 4 surface 가 그림자 강도만 다르게. soft 회색 stage 위에서
     그림자가 정확하게 보임 (white-on-white 회피). */
  [data-part="canvas-elev-tower"] {
    display: flex;
    flex-direction: row;
    gap: ${pad(5)};
    width: max-content;
  }
  [data-part="canvas-elev-tower"] > [data-tile] {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${pad(2)};
  }
  /* elev surface — color swatch 와 같은 160×160 (시각 평행 invariant). */
  [data-part="canvas-elev-tower"] [data-surface] {
    inline-size: 160px;
    block-size: 160px;
    background: ${bg()};
    border-radius: ${radius('sm')};
  }
  [data-part="canvas-elev-tower"] figcaption {
    ${typography('monoMicro')}
    font-weight: ${weight('medium')};
    color: ${text('weak')};
  }

  /* row — specimen 좌측 큰 sample · meta 우측 한 줄 (name + spec).
     디팩토: M3 type scale · Apple HIG · Tailwind type docs. typography·value-primary 공유. */
  [data-part="canvas-type-row"],
  [data-part="canvas-token-row"] {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) max-content;
    align-items: center;
    column-gap: ${pad(6)};
    padding: ${pad(3)} ${pad(4)};
    border-bottom: 1px solid ${border('subtle')};
  }
  [data-part="canvas-type-row"] { align-items: baseline; }
  [data-part="canvas-type-row"]:last-child,
  [data-part="canvas-token-row"]:last-child { border-bottom: none; }
  [data-part="canvas-type-row"] > [data-specimen],
  [data-part="canvas-token-row"] > [data-specimen] {
    line-height: 1.1;
    color: ${text('strong')};
  }
  [data-part="canvas-type-row"] > [data-meta],
  [data-part="canvas-token-row"] > [data-meta] {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: flex-end;
    text-align: end;
  }
  [data-part="canvas-type-row"] > [data-meta] > [data-name],
  [data-part="canvas-token-row"] > [data-meta] > [data-name] {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('subtle')};
  }
  [data-part="canvas-type-row"] > [data-meta] > [data-spec],
  [data-part="canvas-token-row"] > [data-meta] > [data-spec] {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('weak')};
  }

  /* comp-card = frame 없는 stage + 아래 캡션 (Figma instance 스타일).
     이전: subgrid 로 캡션 정렬했으나 부모 행 높이가 min(stage 들) 로 고정돼 큰 demo 잘림.
     변경: flex column → stage 가 자기 컨텐츠 만큼 자라고 컨텐츠 절대 잘리지 않음. 캡션 정렬은 포기. */
  /* 카드 = 독립 bordered frame. gap 으로 분리, 모서리 라운딩으로 frame 어포던스. */
  [data-part="canvas-comp-card"] {
    margin: 0;
    min-width: 0;
    grid-row: span 2;
    display: grid;
    grid-template-rows: subgrid;
    row-gap: 0;
    border: 1px solid ${border()};
    border-radius: ${radius('md')};
    ${pair({ bg: bg(), fg: text('strong') })}
    overflow: hidden;
    cursor: pointer;
    transition: border-color 120ms ease;
    position: relative;
  }
  [data-part="canvas-comp-card"]:hover { border-color: ${text('weak')}; }
  [data-part="canvas-comp-card"][data-selected] { border-color: currentColor; }
  [data-part="canvas-comp-card"]:hover {
    outline-color: ${border('subtle')};
  }
  [data-part="canvas-comp-card"][data-selected] {
    outline-color: currentColor;
  }
  [data-part="canvas-comp-card"][data-selected] > figcaption {
    font-weight: ${weight('semibold')};
  }
  /* stage = bordered cell 안 컨텐츠 영역. border·bg 는 부모 카드가 소유. */
  [data-part="canvas-comp-card"] > [data-stage] {
    min-height: 140px;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: ${pad(4)};
    box-sizing: border-box;
    /* demo 안 position:fixed → 카드 기준 scope (viewport 비참조).
       transform: translateZ(0) 로 containing block 생성. overflow:visible 로 내용 안 잘림. */
    transform: translateZ(0);
    isolation: isolate;
    position: relative;
    overflow: visible;
  }
  [data-part="canvas-comp-card"] > [data-stage][data-empty] {
    opacity: 0.65;
    font-family: ${typeRole.mono.fontFamily};
    font-size: ${font('xs')};
    font-weight: ${weight('regular')};
    border: 1px dashed ${border('subtle')};
    border-radius: ${radius('sm')};
    min-height: 56px;
  }
  /* caption = 데모 보조 라벨. 시선은 데모로 — caption 은 모든 차원(크기·색·면)에서 양보.
     bg tint ❌ (흰 stage 와 명도 대비가 시각 신호 1순위 됨), hairline ❌ (gap+border 가 이미 카드 정의),
     small mono · text('subtle') 로 노이즈 최소화. */
  [data-part="canvas-comp-card"] > figcaption {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('subtle')};
    padding: ${pad(1)} ${pad(3)} ${pad(2)};
    background: transparent;
    text-align: center;
    align-self: stretch;
  }

  [data-part="canvas-stage-empty"] {
    ${typography('mono')}
    opacity: 0.65;
    padding: ${pad(4)};
    border: 1px dashed ${border('subtle')};
    border-radius: ${radius('sm')};
    min-width: 320px;
  }

  /* ── State — 단순화. grid: 카드 어레이, matrix: 비교 표.  표 hairline 제거, gap만으로 분리. */
  [data-part="canvas-state-grid"] {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 260px));
    gap: ${pad(4)};
    width: max-content;
  }

  /* State matrix — 행=role/context, 열=variant. column header 는 micro mono eyebrow, hairline ❌. */
  [data-part="canvas-state-matrix"] {
    display: grid;
    grid-template-columns: max-content repeat(3, minmax(180px, 220px));
    column-gap: ${pad(4)};
    row-gap: ${pad(3)};
    align-items: center;
    width: max-content;
  }
  [data-part="canvas-state-matrix"] > [data-row] {
    display: contents;
  }
  [data-part="canvas-state-matrix"] > [data-row] > [role="columnheader"] {
    ${typography('monoMicro')}
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: ${text('weak')};
    padding: 0;
  }
  [data-part="canvas-state-matrix"] > [data-row] > [data-cell="role"] {
    display: flex;
    flex-direction: column;
    gap: ${pad(0.5)};
    align-items: flex-start;
  }
  [data-part="canvas-state-matrix"] > [data-row] > [data-cell] {
    min-inline-size: 0;
  }

  /* detail panel — viewport 우하단 floating wrapper만. 내부는 ds parts/Card. */
  [data-part="canvas-detail"] {
    position: fixed;
    right: 24px;
    bottom: 24px;
    width: 360px;
    max-height: calc(100vh - 48px);
    overflow: auto;
    z-index: 10;
  }
  ${previewCss}
`

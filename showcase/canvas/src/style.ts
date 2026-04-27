import { css, radius, pair, bg, text, surface, border, mute, typography, type as typeRole } from '@p/ds/tokens/foundations'
import { weight, pad, font } from '@p/ds/tokens/palette'
import { TONE } from './canvas-tones'

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
    ${pair({ bg: surface('subtle'), fg: text('strong') })}
    ${typography('body')}
    font-family: system-ui, sans-serif;
  }

  [data-part="canvas-board"] {
    width: max-content;
    min-width: 100vw;
    padding: 64px 80px 96px;
  }

  [data-part="canvas-header"] {
    margin-bottom: ${pad(8)};
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
    background: color-mix(in oklab, var(--tone) 1.5%, transparent);
  }
  [data-part$="-column"][data-tone="blue"]    { --tone: ${TONE.blue}; }
  [data-part$="-column"][data-tone="green"]   { --tone: ${TONE.green}; }
  [data-part$="-column"][data-tone="amber"]   { --tone: ${TONE.amber}; }

  /* tier 별 폭 + density gradient (L0 dense → L5 spacious) */
  [data-part="canvas-palette-column"]      { width: 2200px; gap: ${pad(14)}; }
  [data-part="canvas-semantic-column"]     { width: 1300px; gap: ${pad(14)}; }
  [data-part="canvas-empty-column"]        { width: 720px;  gap: ${pad(16)}; }
  [data-part="canvas-bucket-l2-column"]    { width: 1400px; gap: ${pad(18)}; }
  [data-part="canvas-bucket-l3-column"]    { width: 1600px; gap: ${pad(20)}; }
  [data-part="canvas-bucket-l4-column"]    { width: 1200px; gap: ${pad(22)}; }
  [data-part="canvas-bucket-l5-column"]    { width: 1100px; gap: ${pad(24)}; }
  /* Section 이 layer 폭 안에 머물도록 제한. */
  [data-part="canvas-palette-column"] [data-part="canvas-section"],
  [data-part="canvas-semantic-column"] [data-part="canvas-section"],
  [data-part="canvas-atoms-column"] [data-part="canvas-section"],
  [data-part="canvas-composed-column"] [data-part="canvas-section"] {
    max-width: 100%;
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
  [data-part="canvas-column-banner"][data-tone="blue"]   { --tone: ${TONE.blue}; }
  [data-part="canvas-column-banner"][data-tone="green"]  { --tone: ${TONE.green}; }
  [data-part="canvas-column-banner"][data-tone="amber"]  { --tone: ${TONE.amber}; }

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
  [data-part="canvas-palette-groups"] {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${pad(8)};
    align-items: flex-start;
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
    grid-template-columns: 240px minmax(0, 1fr);
    column-gap: ${pad(8)};
    width: max-content;
    box-sizing: border-box;
    padding-top: ${pad(6)};
    border-top: 1px solid ${border('subtle')};
  }
  [data-part="canvas-section"]:first-child { border-top: none; padding-top: 0; }

  /* L gutter — 섹션 헤더 sticky (긴 그리드 스크롤 시 라벨 유지) */
  [data-part="canvas-section-header"] {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: sticky;
    top: ${pad(4)};
    align-self: start;
  }

  /* section tag — column-tinted accent bar(4px) 옆 제목. fg 는 column 에서 inherit. */
  [data-part="canvas-section-tag"] {
    ${typography('display')}
    letter-spacing: -0.018em;
    line-height: 1.1;
    display: grid;
    grid-template-columns: 3px auto;
    column-gap: ${pad(2.5)};
    align-items: baseline;
    background: transparent;
    padding: 0;
    margin: 0;
    text-transform: none;
  }
  [data-part="canvas-section-tag"] > [data-marker] {
    grid-row: 1 / -1;
    align-self: stretch;
    width: 3px;
    background: var(--tone, ${TONE.neutral});
    border-radius: 2px;
    transform: none;
  }
  [data-part="canvas-section-tag"] > [data-title] {
    font-weight: ${weight('bold')};
  }
  [data-part="canvas-section-tag"] > small {
    ${typography('monoMicro')}
    font-weight: ${weight('medium')};
    opacity: 0.65;
    grid-column: 2;
    margin-top: 2px;
  }
  [data-part="canvas-section-tag"] > [data-subtitle] {
    font-family: ${typeRole.mono.fontFamily};
    font-size: ${font('xs')};
    font-weight: ${weight('regular')};
    opacity: 0.65;
    text-transform: none;
    grid-column: 2;
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

  [data-part="canvas-subgroup"] { margin-bottom: ${pad(6)}; }
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
  [data-part="canvas-grid-color"] {
    display: grid;
    grid-template-columns: repeat(var(--cols, 4), minmax(110px, max-content));
    grid-auto-rows: auto;
    column-gap: ${pad(4)};
    row-gap: ${pad(4)};
  }
  [data-part="canvas-grid-value"] {
    display: grid;
    grid-template-columns: repeat(var(--cols, 3), minmax(132px, max-content));
    grid-auto-rows: auto;
    column-gap: ${pad(4)};
    row-gap: ${pad(4)};
  }
  [data-part="canvas-grid-comp"] {
    display: grid;
    grid-template-columns: repeat(var(--cols, 3), minmax(280px, max-content));
    grid-auto-rows: auto;
    column-gap: ${pad(4)};
    row-gap: ${pad(4)};
  }
  [data-part="canvas-type-stack"] { width: max-content; min-width: 280px; }
  [data-part="canvas-type-stack"] {
    display: flex; flex-direction: column;
  }

  /* 카드는 3행 subgrid로 (visual / name / call) 내부 행이 섹션 그리드의 행에
     attached → 모든 카드의 텍스트 baseline이 동일 위치에서 시작된다. */
  [data-part="canvas-token-card"] {
    margin: 0;
    display: grid;
    grid-row: span 3;
    grid-template-rows: subgrid;
    row-gap: ${pad(2)};
    min-width: 0;
    /* 성능: 뷰포트 밖 layout/paint 스킵 */
    content-visibility: auto;
    contain-intrinsic-size: 160px 220px;
    contain: layout paint style;
  }
  [data-part="canvas-token-card"] > [data-swatch],
  [data-part="canvas-token-card"] > [data-sample],
  [data-part="canvas-token-card"] > [data-frame] {
    align-self: start;
  }
  [data-part="canvas-token-card"] > [data-swatch] {
    width: 100%;
    min-height: 80px;
    aspect-ratio: 1 / 1;
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('md')};
    box-shadow: 0 1px 2px color-mix(in oklab, CanvasText 4%, transparent);
  }
  /* 흰색·투명 식별을 위한 체커보드 — alpha 절반 줄여 노이즈 감소 */
  [data-part="canvas-token-card"][data-token-type="color"] > [data-swatch] {
    background-image:
      linear-gradient(45deg, color-mix(in oklab, CanvasText 4%, transparent) 25%, transparent 25%, transparent 75%, color-mix(in oklab, CanvasText 4%, transparent) 75%),
      linear-gradient(45deg, color-mix(in oklab, CanvasText 4%, transparent) 25%, transparent 25%, transparent 75%, color-mix(in oklab, CanvasText 4%, transparent) 75%);
    background-size: 16px 16px;
    background-position: 0 0, 8px 8px;
  }
  [data-part="canvas-token-card"] > [data-sample] {
    min-height: 80px;
    width: 100%;
    display: grid; place-items: center;
    padding: ${pad(2)};
    box-sizing: border-box;
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('md')};
    box-shadow: 0 1px 2px color-mix(in oklab, CanvasText 4%, transparent);
  }
  [data-part="canvas-token-card"] > [data-frame] {
    min-height: 80px;
    width: 100%;
    padding: ${pad(3)};
    display: grid; place-items: center;
    ${pair({ bg: bg(), fg: text('strong') })}
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('md')};
    box-sizing: border-box;
    box-shadow: 0 1px 2px color-mix(in oklab, CanvasText 4%, transparent);
  }
  [data-part="canvas-token-card"] > [data-name] {
    ${typography('captionStrong')}
    letter-spacing: -0.01em;
    align-self: end;
    line-height: 1.3;
  }
  [data-part="canvas-token-card"] > [data-call] {
    font-family: ${typeRole.mono.fontFamily};
    font-size: ${font('xs')};
    font-weight: ${weight('medium')};
    opacity: 0.65;
    align-self: start;
    word-break: break-all;
    line-height: 1.4;
    letter-spacing: 0.01em;
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
    font-family: ${typeRole.mono.fontFamily};
    font-size: ${font('xs')};
    font-weight: ${weight('regular')};
    opacity: 0.65;
    letter-spacing: 0.04em;
  }

  /* ── Spacing bar stack — Material 3 spacing reference · Polaris space 수렴. ──
     [라벨 · 막대 · 값] 가로 행. 막대 길이 = 실제 pad value.
     monospace 라벨/값으로 baseline 정렬, 막대는 tone 색의 8% alpha tinted. */
  [data-part="canvas-space-stack"] {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    column-gap: ${pad(4)};
    row-gap: ${pad(1)};
    align-items: center;
    width: max-content;
    min-width: 360px;
    padding: ${pad(2)} 0;
  }
  [data-part="canvas-space-stack"] > [data-row] {
    display: contents;
  }
  [data-part="canvas-space-stack"] [data-label] {
    ${typography('monoMicro')}
    font-weight: ${weight('medium')};
    opacity: 0.80;
    letter-spacing: 0.02em;
  }
  [data-part="canvas-space-stack"] [data-bar] {
    block-size: 14px;
    background: var(--tone, ${text()});
    opacity: 0.85;
    border-radius: ${radius('sm')};
    min-inline-size: 1px;
  }
  [data-part="canvas-space-stack"] [data-value] {
    font-family: ${typeRole.mono.fontFamily};
    font-size: ${font('xs')};
    font-weight: ${weight('regular')};
    opacity: 0.65;
    text-align: end;
  }

  /* ── Elevation tower — Material 3 surface tonal elevation 수렴. ──
     같은 stage 위 4 surface 가 그림자 강도만 다르게. soft 회색 stage 위에서
     그림자가 정확하게 보임 (white-on-white 회피). */
  [data-part="canvas-elev-tower"] {
    display: flex;
    flex-direction: row;
    gap: ${pad(5)};
    padding: ${pad(5)} ${pad(4)};
    background: ${surface('muted')};
    border-radius: ${radius('md')};
    width: max-content;
  }
  [data-part="canvas-elev-tower"] > [data-tile] {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${pad(2)};
  }
  [data-part="canvas-elev-tower"] [data-surface] {
    inline-size: 80px;
    block-size: 80px;
    background: ${bg()};
    border-radius: ${radius('sm')};
  }
  [data-part="canvas-elev-tower"] figcaption {
    ${typography('monoMicro')}
    font-weight: ${weight('medium')};
    opacity: 0.65;
  }

  [data-part="canvas-type-row"] {
    display: flex; flex-direction: column;
    gap: 4px;
    padding: ${pad(2)} 0;
    border-bottom: 1px dashed ${border('subtle')};
  }
  [data-part="canvas-type-row"]:last-child { border-bottom: 0; }
  [data-part="canvas-type-row"] > [data-specimen] {
    line-height: 1.1;
    font-weight: ${weight('semibold')};
  }
  [data-part="canvas-type-row"] > [data-meta] {
    ${typography('micro')}
    opacity: 0.65;
  }

  /* comp-card = frame 없는 stage + 아래 캡션 (Figma instance 스타일).
     이전: subgrid 로 캡션 정렬했으나 부모 행 높이가 min(stage 들) 로 고정돼 큰 demo 잘림.
     변경: flex column → stage 가 자기 컨텐츠 만큼 자라고 컨텐츠 절대 잘리지 않음. 캡션 정렬은 포기. */
  [data-part="canvas-comp-card"] {
    margin: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    border: none;
    background: transparent;
    overflow: visible;
    cursor: pointer;
    border-radius: ${radius('sm')};
    transition: outline-color 120ms ease;
    outline: 2px solid transparent;
    contain: layout style;
    outline-offset: 2px;
  }
  [data-part="canvas-comp-card"]:hover {
    outline-color: ${border('subtle')};
  }
  [data-part="canvas-comp-card"][data-selected] {
    outline-color: currentColor;
  }
  [data-part="canvas-comp-card"][data-selected] > figcaption {
    font-weight: ${weight('semibold')};
  }
  [data-part="canvas-comp-card"] > [data-stage] {
    min-height: 64px;
    display: grid; place-items: center;
    padding: ${pad(2)};
    background: transparent;
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
  [data-part="canvas-comp-card"] > figcaption {
    font-family: ${typeRole.mono.fontFamily};
    font-size: ${font('xs')};
    font-weight: ${weight('regular')};
    opacity: 0.65;
    padding: ${pad(2)} 0 0;
    border-top: none;
    text-align: center;
  }

  [data-part="canvas-stage-empty"] {
    ${typography('mono')}
    opacity: 0.65;
    padding: ${pad(4)};
    border: 1px dashed ${border('subtle')};
    border-radius: ${radius('sm')};
    min-width: 320px;
  }

  /* State base — Card grid (parts/Card 가 시각 담당). */
  [data-part="canvas-state-grid"] {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: ${pad(3)};
    width: 100%;
  }

  /* State matrix — 행=role/context, 열=variant. variant 가 세로 정렬돼 비교 용이. */
  [data-part="canvas-state-matrix"] {
    display: grid;
    grid-template-columns: minmax(200px, max-content) repeat(3, minmax(200px, 1fr));
    column-gap: ${pad(3)};
    row-gap: ${pad(2)};
    align-items: center;
    width: 100%;
  }
  [data-part="canvas-state-matrix"] > [data-row] {
    display: contents;
  }
  [data-part="canvas-state-matrix"] > [data-row] > [role="columnheader"] {
    ${typography('monoMicro')}
    font-weight: ${weight('medium')};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.65;
    border-bottom: 1px solid ${border('subtle')};
    padding: ${pad(1)} 0;
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
`

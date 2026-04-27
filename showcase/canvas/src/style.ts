import { css, neutral, pad, radius, weight, microLabel, pair, bg, text, surface, border } from '@p/ds/tokens/foundations'
import { TONE } from './canvas-tones'

/**
 * Canvas — 자산 SSOT viewer. data-part 네임스페이스로 셀렉터 캡슐화.
 *
 *   canvas-app          크림 배경, fixed inset 0 (zoom-pan viewport)
 *   canvas-page         포스터 본문 (board 폭 결정)
 *   canvas-header       타이틀 + 메타
 *   canvas-{palette,semantic,components}-page  L0/L1/L2 시퀀스 페이지
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
    font: 400 14px system-ui, sans-serif;
  }

  [data-part="canvas-page"] {
    width: max-content;
    min-width: 100vw;
    padding: 64px 80px 96px;
  }

  [data-part="canvas-header"] {
    margin-bottom: ${pad(8)};
  }
  [data-part="canvas-header"] > [data-meta] {
    font: 500 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${text('mute')};
    margin-bottom: ${pad(2)};
  }
  [data-part="canvas-header"] > h1 {
    font: 800 64px system-ui;
    letter-spacing: -0.03em;
    line-height: 1;
    margin: 0 0 ${pad(2)};
  }
  [data-part="canvas-header"] > [data-stats] {
    font: 400 14px system-ui;
    color: ${text('subtle')};
  }
  [data-part="canvas-header"] code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
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
    gap: ${pad(12)};
  }
  [data-part="canvas-palette-page"],
  [data-part="canvas-semantic-page"],
  [data-part="canvas-atoms-page"],
  [data-part="canvas-composed-page"] {
    --tone: ${TONE.neutral};
    display: flex;
    flex-direction: column;
    gap: ${pad(20)};
    flex: 0 0 auto;
    padding-right: ${pad(10)};
    border-right: 1px dashed ${border('subtle')};
  }
  [data-part="canvas-palette-page"][data-tone="neutral"]    { --tone: ${TONE.neutral}; }
  [data-part="canvas-semantic-page"][data-tone="blue"]      { --tone: ${TONE.blue}; }
  [data-part="canvas-atoms-page"][data-tone="green"]        { --tone: ${TONE.green}; }
  [data-part="canvas-composed-page"][data-tone="amber"]     { --tone: ${TONE.amber}; }
  /* 각 레이어 폭 = 그 레이어의 가장 넓은 SectionFrame max-content + padding 여유. */
  [data-part="canvas-palette-page"]   { width: 2200px; }
  [data-part="canvas-semantic-page"]  { width: 1300px; }
  [data-part="canvas-atoms-page"]     { width: 1400px; }
  [data-part="canvas-composed-page"] {
    width: 2400px;
    border-right: none;
    padding-right: 0;
  }
  /* Section 이 layer 폭 안에 머물도록 제한. */
  [data-part="canvas-palette-page"] [data-part="canvas-section"],
  [data-part="canvas-semantic-page"] [data-part="canvas-section"],
  [data-part="canvas-atoms-page"] [data-part="canvas-section"],
  [data-part="canvas-composed-page"] [data-part="canvas-section"] {
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
  /* ── PageDivider — L0/L1/L2/L3 column 헤더. lane(◆) 보다 강한 분리. ──
     수렴 어휘: Brad Frost tone, Vercel mono eyebrow, Atlassian display title,
     Material 3 stripe, Untitled UI hint. */
  [data-part="canvas-page-divider"] {
    --tone: ${TONE.neutral};
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${pad(3)};
    margin-bottom: ${pad(8)};
    padding-top: ${pad(4)};
  }
  [data-part="canvas-page-divider"][data-tone="blue"]   { --tone: ${TONE.blue}; }
  [data-part="canvas-page-divider"][data-tone="green"]  { --tone: ${TONE.green}; }
  [data-part="canvas-page-divider"][data-tone="amber"]  { --tone: ${TONE.amber}; }

  [data-part="canvas-page-divider-stripe"] {
    height: 8px;
    width: 100%;
    background: var(--tone);
    border-radius: 1px;
  }
  [data-part="canvas-page-divider-eyebrow"] {
    display: inline-flex;
    gap: 10px;
    align-items: baseline;
    font: 600 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--tone);
  }
  [data-part="canvas-page-divider-eyebrow"] > span:nth-child(2) {
    color: ${text('mute')};
  }
  [data-part="canvas-page-divider-eyebrow"] > span:nth-child(3) {
    color: ${text('mute')};
    letter-spacing: 0.14em;
  }

  [data-part="canvas-page-divider-head"] {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: ${pad(5)};
  }
  [data-part="canvas-page-divider-numeral"] {
    font: 200 96px system-ui;
    line-height: 0.85;
    letter-spacing: -0.06em;
    color: var(--tone);
    flex: none;
    user-select: none;
    /* 시각 닻 — title 보다 거대하지만 weight 200 으로 약해서 위계 안 흔든다 */
    opacity: 0.92;
  }
  [data-part="canvas-page-divider-title"] {
    font: 800 56px system-ui;
    letter-spacing: -0.03em;
    line-height: 1.0;
    color: ${text('strong')};
    margin: 0;
  }
  [data-part="canvas-page-divider-subtitle"] {
    font: 500 13px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('mute')};
    letter-spacing: 0.02em;
    margin-top: ${pad(2)};
  }
  [data-part="canvas-page-divider-hint"] {
    font: 400 13px system-ui;
    color: ${text('subtle')};
    line-height: 1.55;
    margin: 0;
    max-width: 56ch;
    padding-bottom: ${pad(4)};
    border-bottom: 1px solid ${border('subtle')};
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
  [data-part="canvas-palette-page"] [data-part="theme-creator"] [aria-label="Theme preview"] {
    display: none !important;
  }
  [data-part="canvas-palette-page"] [data-part="theme-creator"] header > h1 {
    font: 600 12px ui-monospace, SFMono-Regular, Menlo, monospace !important;
    color: ${text('mute')} !important;
    margin: 0 !important;
  }

  /* ── Section (lane) — page 안 단위. tone 은 부모 page 에서 CSS 상속. ── */
  [data-part="canvas-section"] {
    position: relative;
    width: max-content;
    box-sizing: border-box;
    background: transparent;
    border: none;
    border-radius: 0;
    padding: ${pad(6)} 0 0;
    flex: none;
  }
  /* 섹션 시작 marker — tone 색 2px 실선 (alpha 강화). 첫 섹션도 표시 (page divider 다음 시각 anchor). */
  [data-part="canvas-section"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 32px;
    height: 2px;
    background: var(--tone, ${TONE.neutral});
    border-radius: 1px;
  }

  /* header 묶기 — title/subtitle/count/standard 가 한 시각 블록으로 읽힘 */
  [data-part="canvas-section-header"] {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: ${pad(5)};
    padding-bottom: ${pad(3)};
    border-bottom: 1px solid ${border('subtle')};
  }

  [data-part="canvas-section-tag"] {
    position: static;
    color: ${text('strong')};
    font: 600 18px Inter, system-ui;
    letter-spacing: -0.01em;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    padding: 0;
    margin: 0;
    text-transform: none;
  }
  [data-part="canvas-section-tag"] > [data-marker] {
    width: 10px; height: 10px;
    background: var(--tone, ${TONE.neutral});
    transform: rotate(45deg);
    border-radius: 1px;
    flex: none;
  }
  [data-part="canvas-section-tag"] > [data-title] {
    font-weight: ${weight('bold')};
    color: ${text('strong')};
  }
  [data-part="canvas-section-tag"] > small {
    font: 500 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('mute')};
    margin-left: auto;
    padding-left: ${pad(3)};
  }
  [data-part="canvas-section-tag"] > [data-subtitle] {
    font: 400 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('mute')};
    text-transform: none;
  }
  [data-part="canvas-section-standard"] {
    font: 400 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.02em;
    color: ${text('mute')};
    padding-left: 20px; /* marker(10px) + gap(10px) 정렬 */
  }

  [data-part="canvas-shape-group"] {
    display: flex;
    flex-direction: column;
    gap: ${pad(2)};
    margin-bottom: ${pad(5)};
  }
  [data-part="canvas-shape-group"]:last-child { margin-bottom: 0; }
  [data-part="canvas-shape-label"] {
    font: 400 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('mute')};
    letter-spacing: 0;
  }

  [data-part="canvas-subgroup"] { margin-bottom: ${pad(5)}; }
  [data-part="canvas-subgroup"]:last-child { margin-bottom: 0; }
  [data-part="canvas-subgroup"] > h3 {
    ${microLabel()}
    color: ${text('subtle')};
    margin: 0 0 ${pad(3)};
    padding-bottom: ${pad(1.5)};
    border-bottom: 1px dashed ${border('subtle')};
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
    grid-template-columns: repeat(var(--cols, 3), minmax(200px, max-content));
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
    border: 1px solid ${border()};
    border-radius: ${radius('sm')};
  }
  /* 흰색·투명 식별을 위한 체커보드 hint — Photoshop·Figma 디팩토.
     2×2 정사각 체커: 같은 45° gradient 2장을 half-cell offset 으로 겹쳐서
     사각형 패턴 (삼각형 ❌) 형성. 8px cell × 2 = 16px tile. */
  [data-part="canvas-token-card"][data-token-type="color"] > [data-swatch] {
    background-image:
      linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%),
      linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%);
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
    border-radius: ${radius('sm')};
  }
  [data-part="canvas-token-card"] > [data-frame] {
    min-height: 80px;
    width: 100%;
    padding: ${pad(3)};
    display: grid; place-items: center;
    /* surface owner — bg() 위 text() 페어. 안에서 그려지는 demo 가 정확한 대비
       위에서 측정되도록. neutral(N) 직접 사용 금지(palette tier 로 호출은 정본
       위배). pair() recipe 가 SSOT. */
    ${pair({ bg: bg(), fg: text('strong') })}
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('sm')};
    box-sizing: border-box;
  }
  [data-part="canvas-token-card"] > [data-name] {
    font: 500 12px system-ui;
    color: ${text('strong')};
    align-self: end;
  }
  [data-part="canvas-token-card"] > [data-call] {
    font: 400 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('mute')};
    align-self: start;
    word-break: break-all;
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
    color: ${text('strong')};
    transition: transform 160ms ease, z-index 0s 160ms;
    cursor: default;
  }
  [data-part="canvas-color-ramp"] [data-tile][data-dark] { color: ${TONE.fgOnDark}; }
  [data-part="canvas-color-ramp"] [data-tile]:hover {
    transform: translateY(-2px);
    z-index: 1;
    transition: transform 160ms ease, z-index 0s 0s;
    box-shadow: 0 6px 16px rgba(0,0,0,0.18);
  }
  [data-part="canvas-color-ramp"] [data-tile] > [data-step] {
    font: 600 13px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.04em;
    align-self: flex-start;
  }
  [data-part="canvas-color-ramp"] [data-tile] > [data-hex] {
    font: 500 10px ui-monospace, SFMono-Regular, Menlo, monospace;
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
    font: 500 12px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text()};
  }
  [data-part="canvas-color-ramp"] > [data-meta] > [data-range] {
    font: 400 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('mute')};
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
    font: 500 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('subtle')};
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
    font: 400 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('mute')};
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
    font: 500 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('mute')};
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
    color: ${text('strong')};
  }
  [data-part="canvas-type-row"] > [data-meta] {
    font: 400 11px system-ui;
    color: ${text('mute')};
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
    outline-color: ${text('strong')};
  }
  [data-part="canvas-comp-card"][data-selected] > figcaption {
    color: ${text('strong')};
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
    color: ${text('mute')};
    font: 400 10px ui-monospace, SFMono-Regular, Menlo, monospace;
    border: 1px dashed ${border('subtle')};
    border-radius: ${radius('sm')};
    min-height: 56px;
  }
  [data-part="canvas-comp-card"] > figcaption {
    font: 400 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('mute')};
    padding: ${pad(2)} 0 0;
    border-top: none;
    text-align: center;
  }

  [data-part="canvas-stage-empty"] {
    font: 400 12px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${text('mute')};
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
    font: 500 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${text('mute')};
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

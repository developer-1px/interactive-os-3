import { css, neutral, pad, radius, microLabel } from '@p/ds/tokens/foundations'

/**
 * Canvas — 자산 SSOT viewer. data-part 네임스페이스로 셀렉터 캡슐화.
 *
 *   canvas-app          크림 배경, fixed inset 0 (zoom-pan viewport)
 *   canvas-page         포스터 본문 (board 폭 결정)
 *   canvas-header       타이틀 + 메타
 *   canvas-board        2D wrap 보드 (섹션 타일링)
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
    background: #f5f5f5;
    color: ${neutral(9)};
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
    color: ${neutral(6)};
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
    color: ${neutral(7)};
  }
  [data-part="canvas-header"] code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
  }

  /* 보드: zone(Theme · Foundations · Components · Devices)을 가로 lane으로 배치.
     알터네이팅 axis BP — 외곽=가로(zone 컬럼), zone 안 sections=세로 stack, section 안=세로, cards=row-major. */
  [data-part="canvas-board"] {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: ${pad(16)};
    padding-top: ${pad(4)};
  }

  /* zone = whitespace 구분만. fill·border 없음. 큰 sans-serif 라벨로 단계 표현 */
  [data-part="canvas-zone"] {
    display: flex;
    flex-direction: column;
    gap: ${pad(7)};
    padding: 0;
    flex: none;
    width: max-content;
  }
  [data-part="canvas-zone-label"] {
    font: 700 28px system-ui;
    letter-spacing: -0.02em;
    color: #1e1e1e;
    display: inline-flex;
    align-items: baseline;
    gap: 12px;
  }
  [data-part="canvas-zone-label"] > small {
    font: 500 13px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0;
    color: #999;
  }
  /* zone 안 섹션 — 외곽이 row로 바뀌었으므로 zone 내부는 세로 stack */
  [data-part="canvas-zone-row"] {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${pad(10)};
    padding-top: ${pad(2)};
  }

  /* lane = frame 없음. 작은 ◇ + 회색 라벨 + 아이템들이 캔버스에 직접 떠 있음 */
  [data-part="canvas-section"] {
    position: relative;
    width: max-content;
    box-sizing: border-box;
    background: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    flex: none;
  }

  [data-part="canvas-section-tag"] {
    position: static;
    color: #999;
    font: 500 13px Inter, system-ui;
    letter-spacing: 0;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    padding: 0;
    margin-bottom: ${pad(4)};
    text-transform: none;
  }
  [data-part="canvas-section-tag"]::before {
    content: '';
    width: 10px; height: 10px;
    background: #b8b8b8;
    transform: rotate(45deg);
    border-radius: 1px;
    flex: none;
  }
  [data-part="canvas-section-tag"] > small {
    font: 500 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: #b0b0b0;
  }
  [data-part="canvas-section-tag"] > [data-subtitle] {
    font: 400 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: #c0c0c0;
    text-transform: none;
  }
  [data-part="canvas-section-standard"] {
    font: 400 10px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.02em;
    color: #999;
    margin-bottom: ${pad(3)};
    padding-bottom: ${pad(2)};
    border-bottom: 1px dashed rgba(0,0,0,0.08);
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
    color: #b0b0b0;
    letter-spacing: 0;
  }

  [data-part="canvas-subgroup"] { margin-bottom: ${pad(5)}; }
  [data-part="canvas-subgroup"]:last-child { margin-bottom: 0; }
  [data-part="canvas-subgroup"] > h3 {
    ${microLabel()}
    color: ${neutral(7)};
    margin: 0 0 ${pad(3)};
    padding-bottom: ${pad(1.5)};
    border-bottom: 1px dashed rgba(0,0,0,0.12);
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
    border: 1px solid rgba(0,0,0,0.16);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
    border-radius: 2px;
  }
  /* 흰색·투명 식별을 위한 체커보드 hint */
  [data-part="canvas-token-card"][data-token-type="color"] > [data-swatch] {
    background-image:
      linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(0,0,0,0.04) 25%, transparent 25%);
    background-size: 8px 8px;
    background-position: 0 0, 4px 4px;
  }
  [data-part="canvas-token-card"] > [data-sample] {
    min-height: 80px;
    width: 100%;
    display: grid; place-items: center;
    padding: ${pad(2)};
    box-sizing: border-box;
  }
  [data-part="canvas-token-card"] > [data-frame] {
    min-height: 80px;
    width: 100%;
    padding: ${pad(3)};
    display: grid; place-items: center;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.06);
    box-sizing: border-box;
  }
  [data-part="canvas-token-card"] > [data-name] {
    font: 500 12px system-ui;
    color: ${neutral(9)};
    align-self: end;
  }
  [data-part="canvas-token-card"] > [data-call] {
    font: 400 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: ${neutral(6)};
    align-self: start;
    word-break: break-all;
  }

  [data-part="canvas-type-row"] {
    display: flex; flex-direction: column;
    gap: 4px;
    padding: ${pad(2)} 0;
    border-bottom: 1px dashed rgba(0,0,0,0.08);
  }
  [data-part="canvas-type-row"]:last-child { border-bottom: 0; }
  [data-part="canvas-type-row"] > [data-specimen] {
    line-height: 1.1;
    font-weight: 600;
    color: ${neutral(9)};
  }
  [data-part="canvas-type-row"] > [data-meta] {
    font: 400 11px system-ui;
    color: ${neutral(6)};
  }

  /* comp-card도 2행 subgrid (stage · caption) — 캡션이 카드들 사이에서 정렬 */
  /* comp-card = frame 없는 stage + 아래 캡션 (Figma instance 스타일) */
  [data-part="canvas-comp-card"] {
    margin: 0;
    min-width: 0;
    display: grid;
    grid-row: span 2;
    grid-template-rows: subgrid;
    border: none;
    background: transparent;
    overflow: visible;
    cursor: pointer;
    border-radius: 6px;
    transition: outline-color 120ms ease;
    outline: 2px solid transparent;
    /* 성능: 뷰포트 밖이면 layout/paint 스킵 (Chrome/Edge/Safari 17+).
       contain-intrinsic-size로 placeholder 사이즈 제공 → 스크롤 점프·레이아웃 흔들림 방지 */
    content-visibility: auto;
    contain-intrinsic-size: 240px 320px;
    contain: layout paint style;
    outline-offset: 2px;
  }
  [data-part="canvas-comp-card"]:hover {
    outline-color: rgba(0,0,0,0.08);
  }
  [data-part="canvas-comp-card"][data-selected] {
    outline-color: #1e1e1e;
  }
  [data-part="canvas-comp-card"][data-selected] > figcaption {
    color: #1e1e1e;
    font-weight: 600;
  }
  [data-part="canvas-comp-card"] > [data-stage] {
    min-height: 64px;
    display: grid; place-items: center;
    padding: ${pad(2)};
    background: transparent;
  }
  [data-part="canvas-comp-card"] > [data-stage][data-empty] {
    color: #c8c8c8;
    font: 400 10px ui-monospace, SFMono-Regular, Menlo, monospace;
    border: 1px dashed #dcdcdc;
    border-radius: 4px;
    min-height: 56px;
  }
  [data-part="canvas-comp-card"] > figcaption {
    font: 400 11px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: #999;
    padding: ${pad(2)} 0 0;
    border-top: none;
    text-align: center;
  }

  [data-part="canvas-stage-empty"] {
    font: 400 12px ui-monospace, SFMono-Regular, Menlo, monospace;
    color: #b8b8b8;
    padding: ${pad(4)};
    border: 1px dashed #dcdcdc;
    border-radius: 4px;
    min-width: 320px;
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

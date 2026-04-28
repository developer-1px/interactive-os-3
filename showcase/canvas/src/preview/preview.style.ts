/**
 * preview.style.ts — TokenPreview cell 의 통합 시각 스타일.
 *
 * 모든 kind 가 공유하는 figure frame (border + caption layout) 정의.
 * kind-specific 시각 (swatch / specimen / bar / dot 등) 은 [data-kind="X"] 셀렉터로.
 *
 * 셀렉터:
 *   [data-part="canvas-preview"]                root figure (160px 정사각, bordered, mono caption)
 *   [data-part="canvas-preview"] > [data-stage] 시각 영역
 *   [data-part="canvas-preview"] > [data-name]  caption 라벨
 *   [data-part="canvas-preview"] > [data-call]  caption 보조 (함수 호출 표기)
 *
 *   [data-part="canvas-scale"]                  TokenScale aggregator (flex row wrap)
 *   [data-part="canvas-scale"][data-kind=...]   kind 별 복수 layout override (TBD)
 */
import { css, radius, pair, bg, text, surface, border, typography } from '@p/ds/tokens/foundations'
import { font, weight, pad } from '@p/ds/tokens/palette'

export const previewCss = css`
  /* ── frame — 160px 정사각, bordered, caption 아래 */
  [data-part="canvas-preview"] {
    margin: 0;
    inline-size: 160px;
    display: grid;
    grid-template-rows: 160px auto auto;
    row-gap: ${pad(1)};
    border: 1px solid ${border()};
    border-radius: ${radius('md')};
    ${pair({ bg: bg(), fg: text('strong') })}
    overflow: hidden;
    align-content: start;
  }
  [data-part="canvas-preview"] > [data-stage] {
    inline-size: 100%;
    block-size: 160px;
    display: grid;
    place-items: center;
    box-sizing: border-box;
  }
  [data-part="canvas-preview"] > [data-name] {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('subtle')};
    padding: 0 ${pad(2)};
    text-align: center;
    line-height: 1.3;
  }
  [data-part="canvas-preview"] > [data-call] {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('subtle')};
    padding: 0 ${pad(2)} ${pad(1.5)};
    text-align: center;
    word-break: break-all;
    line-height: 1.4;
  }

  /* ── kind="color" — stage 가 swatch (full-fill) */
  [data-part="canvas-preview"][data-kind="color"] > [data-stage] {
    padding: 0;
  }

  /* ── kind="length" — bar visualizer */
  [data-part="canvas-preview"][data-kind="length"] [data-bar] {
    block-size: 12px;
    background: ${text('strong')};
    border-radius: ${radius('pill')};
    min-inline-size: 1px;
  }

  /* ── kind="gap" — 두 box + gap between */
  [data-part="canvas-preview"][data-kind="gap"] [data-box] {
    inline-size: 32px;
    block-size: 32px;
    background: ${surface('muted')};
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('sm')};
  }

  /* ── kind="pad" — outer wraps inner */
  [data-part="canvas-preview"][data-kind="pad"] [data-outer] {
    background: ${surface('muted')};
    border: 1px dashed ${border('subtle')};
    border-radius: ${radius('sm')};
  }
  [data-part="canvas-preview"][data-kind="pad"] [data-inner] {
    inline-size: 32px;
    block-size: 32px;
    background: ${bg()};
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('sm')};
  }

  /* ── kind="radius" — rounded box */
  [data-part="canvas-preview"][data-kind="radius"] > [data-stage] {
    background: ${surface('muted')};
  }
  [data-part="canvas-preview"][data-kind="radius"] > [data-stage] > div {
    inline-size: 96px;
    block-size: 96px;
    background: ${bg()};
    border: 1px solid ${border('subtle')};
  }

  /* ── kind="shadow" — elevated card on muted bg */
  [data-part="canvas-preview"][data-kind="shadow"] > [data-stage] {
    background: ${surface('muted')};
  }
  [data-part="canvas-preview"][data-kind="shadow"] > [data-stage] > div {
    inline-size: 80px;
    block-size: 80px;
    background: ${bg()};
    border-radius: ${radius('sm')};
  }

  /* ── kind="borderWidth" / "borderStyle" — line strip */
  [data-part="canvas-preview"][data-kind="borderWidth"] [data-line],
  [data-part="canvas-preview"][data-kind="borderStyle"] [data-line] {
    inline-size: 96px;
    block-size: 0;
    border-color: ${text('strong')};
  }

  /* ── kind="outline" — focus ring on box */
  [data-part="canvas-preview"][data-kind="outline"] [data-box] {
    inline-size: 56px;
    block-size: 32px;
    background: ${bg()};
    border: 1px solid ${border()};
  }

  /* ── kind="opacity" — checker bg + 반투명 overlay */
  [data-part="canvas-preview"][data-kind="opacity"] [data-checker] {
    inline-size: 96px;
    block-size: 96px;
    background-image:
      linear-gradient(45deg, color-mix(in oklab, CanvasText 8%, transparent) 25%, transparent 25%, transparent 75%, color-mix(in oklab, CanvasText 8%, transparent) 75%),
      linear-gradient(45deg, color-mix(in oklab, CanvasText 8%, transparent) 25%, transparent 25%, transparent 75%, color-mix(in oklab, CanvasText 8%, transparent) 75%);
    background-size: 16px 16px;
    background-position: 0 0, 8px 8px;
    position: relative;
  }
  [data-part="canvas-preview"][data-kind="opacity"] [data-overlay] {
    position: absolute; inset: 0;
    background: ${text('strong')};
  }

  /* ── kind="zIndex" / "recipe" / "selector" — mono text */
  [data-part="canvas-preview"][data-kind="zIndex"] code,
  [data-part="canvas-preview"][data-kind="recipe"] code,
  [data-part="canvas-preview"][data-kind="selector"] code {
    ${typography('mono')}
    font-size: ${font('sm')};
    color: ${text('strong')};
  }

  /* ── kind="duration" — animated dot */
  [data-part="canvas-preview"][data-kind="duration"] [data-dot] {
    inline-size: 12px;
    block-size: 12px;
    background: ${text('strong')};
    border-radius: ${radius('pill')};
    animation-name: canvas-preview-dot-bounce;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }
  @keyframes canvas-preview-dot-bounce {
    0%   { transform: translateX(-32px); }
    100% { transform: translateX(32px); }
  }

  /* ── kind="easing" — bezier curve mini-svg */
  [data-part="canvas-preview"][data-kind="easing"] svg {
    color: ${text('strong')};
  }

  /* ── kind="breakpoint" — viewport bar */
  [data-part="canvas-preview"][data-kind="breakpoint"] [data-bar] {
    inline-size: 120px;
    block-size: 24px;
    background: ${surface('muted')};
    border: 1px solid ${border('subtle')};
    border-radius: ${radius('sm')};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-inline-end: ${pad(1.5)};
  }
  [data-part="canvas-preview"][data-kind="breakpoint"] [data-marker] {
    position: absolute;
    inset-block: 0;
    inline-size: 2px;
    background: ${text('strong')};
    inset-inline-end: 30%;
  }
  [data-part="canvas-preview"][data-kind="breakpoint"] [data-value] {
    ${typography('mono')}
    font-size: ${font('xs')};
    color: ${text('subtle')};
  }

  /* ── kind="pair" — Aa swatch */
  [data-part="canvas-preview"][data-kind="pair"] > [data-stage] {
    padding: 0;
    font-weight: ${weight('semibold')};
    font-size: 28px;
  }

  /* ── TokenScale aggregator — 기본 row wrap */
  [data-part="canvas-scale"] {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${pad(4)};
  }
`

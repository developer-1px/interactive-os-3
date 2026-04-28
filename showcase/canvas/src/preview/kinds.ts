/**
 * TokenKind — CSS 값의 의미적 축. 닫힌 vocab.
 *
 * 새 axis 추가 = 이 enum 등재 + preview/<kind>.tsx 1 개. 그 외 코드 0 변경.
 *
 * de facto 수렴: Storybook addon-controls type · Open Props playground kind ·
 * Knapsack token-type registry · Spectrum token-spec.
 */
export type TokenKind =
  // 색
  | 'color'          // 단색 swatch (square fill)
  | 'pair'           // bg+fg "Aa" — text-on-bg
  | 'icon'           // SVG glyph
  // 타이포그래피
  | 'fontSize'       // "Aa 가나 1234" specimen, fontSize 변동
  | 'fontWeight'     // "Bold Aa", fontWeight 변동
  | 'fontFamily'     // "The quick fox", fontFamily 변동
  | 'lineHeight'     // 다중 라인 lorem
  | 'letterSpacing'  // "TRACKING" uppercase
  // 간격·치수
  | 'length'         // bar (width = value)
  | 'gap'            // 두 box + gap between
  | 'pad'            // outer box wrapping inner (padding visualizer)
  // 형상
  | 'radius'         // rounded box
  | 'shadow'         // elevated card
  | 'borderWidth'    // 가로 line strip
  | 'borderStyle'    // — / ---- / ····
  | 'outline'        // focus ring on box
  // 시각 효과
  | 'opacity'        // checker bg + 반투명 overlay
  | 'zIndex'         // 3 stacked cards
  // 모션
  | 'duration'       // animated dot · 또는 mono text
  | 'easing'         // bezier curve mini-svg
  // 반응형
  | 'breakpoint'     // viewport bar + marker
  // escape hatch (preview registry 에 등재만, 구현은 Phase 2)
  | 'recipe'         // CSS rule fragment
  | 'selector'       // 셀렉터 hint

/**
 * fn 이름 → kind 추론. @demo annotation 의 kind= 가 없을 때 fallback.
 *
 * 점진 마이그레이션 패턴: 새 토큰엔 명시 kind=, 기존 토큰은 fn 이름으로 추론.
 * 예외 케이스(fn 이름이 일반적 — `size`, `mix`)는 explicit kind= 권장.
 */
export function inferKind(fn: string): TokenKind {
  // 색
  if (/^(accent|text|surface|border|status|bg|muted|tint|mix|dim|neutral|onAccent|status[A-Z]|accent[A-Z]|surface[A-Z]|current[A-Z]|gradient[A-Z]|scrim|codeSurface|on)$/.test(fn)) return 'color'
  if (/^(pair|tone|toneTint|toneAlpha|emphasize|mute)$/.test(fn)) return 'pair'
  if (fn === 'icon' || fn === 'iconIndicator') return 'icon'
  // 타이포
  if (/^(font|headingSize|headingFluid)$/.test(fn)) return 'fontSize'
  if (fn === 'weight') return 'fontWeight'
  if (fn === 'leading' || fn === 'headingLeading') return 'lineHeight'
  if (fn === 'tracking' || fn === 'trackingScale' || fn === 'underlineOffset') return 'letterSpacing'
  // 간격
  if (fn === 'pad' || fn === 'emStep' || fn === 'inset' || fn === 'insetStep' || fn === 'rowPadding' || fn === 'containerPad') return 'pad'
  if (fn === 'gap' || fn === 'rowGap' || fn === 'slotGap') return 'gap'
  // 형상
  if (fn === 'radius') return 'radius'
  if (fn === 'shadow' || fn === 'elev' || fn === 'level' || fn === 'levelShift') return 'shadow'
  if (fn === 'borderWidth' || fn === 'hairlineWidth') return 'borderWidth'
  if (fn === 'borderStyle') return 'borderStyle'
  if (fn === 'ringWidth' || fn === 'ringOffset' || fn === 'ring') return 'outline'
  // 모션
  if (fn === 'dur') return 'duration'
  if (fn === 'ease') return 'easing'
  // 반응형
  if (fn === 'shellMobileMax' || fn === 'breakpoint') return 'breakpoint'
  // 길이 (마지막 — 일반 fallback)
  if (fn === 'control' || fn === 'size' || fn === 'boxSize' || fn === 'avatarSize' || fn === 'tracks') return 'length'
  // 미분류 — recipe 로 폴백 (raw value 가 아닌 CSS fragment 일 가능성)
  return 'recipe'
}

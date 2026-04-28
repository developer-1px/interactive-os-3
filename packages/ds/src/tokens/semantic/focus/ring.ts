/**
 * focus ring — :focus-visible 시각 신호 표준 mixin + width 토큰.
 *
 * width  → --ds-focus-ring-w (preset.focusRingWidth owner)
 * offset → --ds-focus-ring-offset (preset.focusRingOffset, 기본 2px) — mixin 내부 인라인
 * color  → --ds-accent (focus 색은 accent 슬롯 재사용 — Carbon · Polaris 패턴)
 *
 * widget 안에서 raw `outline: 2px solid blue` ❌ — `${ring()}` mixin 으로.
 *
 *   `&:focus-visible { ${ring()} }`
 *
 * @demo type=recipe fn=ring
 */
export const ring = () => `
  outline: ${ringWidth()} solid var(--ds-accent);
  outline-offset: var(--ds-focus-ring-offset);
`

/**
 * ringWidth — focus ring 두께. focus-equivalent border (layout-shift-free focus)
 * 같은 공유 thickness 가 필요한 곳에서 호출.
 *
 * @demo type=value fn=ringWidth
 */
export const ringWidth = () => `var(--ds-focus-ring-w)`

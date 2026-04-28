/**
 * focus ring — :focus-visible 시각 신호 표준 어휘.
 *   width  → --ds-focus-ring-w (기존 토큰 재사용, preset.focusRingWidth owner)
 *   offset → --ds-focus-ring-offset (기본 2px, preset 으로 갈음 가능)
 *   color  → --ds-accent (focus 색은 accent 슬롯 재사용 — Carbon · Polaris 패턴)
 *
 * widget 안에서 raw `outline: 2px solid blue` ❌ — `${ring()}` mixin 으로.
 *
 * @demo type=value fn=ringWidth
 */
export const ringWidth = () => `var(--ds-focus-ring-w)`

/**
 * @demo type=value fn=ringOffset
 */
export const ringOffset = () => `var(--ds-focus-ring-offset)`

/**
 * focus ring mixin — outline 풀 사양. :focus-visible 셀렉터 안에서 호출.
 *   `&:focus-visible { ${ring()} }`
 */
export const ring = () => `
  outline: ${ringWidth()} solid var(--ds-accent);
  outline-offset: ${ringOffset()};
`

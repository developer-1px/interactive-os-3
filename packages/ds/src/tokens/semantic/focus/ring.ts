/**
 * focus ring — :focus-visible 시각 신호 표준 mixin.
 *
 * width  → --ds-focus-ring-w (preset.focusRingWidth owner)
 * offset → --ds-focus-ring-offset (preset.focusRingOffset, 기본 2px)
 * color  → --ds-accent (focus 색은 accent 슬롯 재사용 — Carbon · Polaris 패턴)
 *
 * widget 안에서 raw `outline: 2px solid blue` ❌ — `${ring()}` mixin 으로.
 *
 *   `&:focus-visible { ${ring()} }`
 *
 * focus-equivalent border (layout-shift-free focus) 같이 ring 두께가 필요하면
 * `var(--ds-focus-ring-w)` 직참 — sys 슬롯이라 raw-palette-var 룰에서 제외.
 *
 * @demo type=recipe fn=ring
 */
export const ring = () => `
  outline: var(--ds-focus-ring-w) solid var(--ds-accent);
  outline-offset: var(--ds-focus-ring-offset);
`

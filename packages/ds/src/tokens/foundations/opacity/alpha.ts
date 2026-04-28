/**
 * opacity semantic — layered alpha standard slots.
 *
 *   scrim    0.32 — modal 뒤 배경 가림 (M3 scrim 32%)
 *   overlay  0.50 — 강한 가림 (사진 위 텍스트)
 *   press    0.12 — pressed state 일시 강조 (M3 state-layer pressed)
 *   hover    0.08 — hover state-layer (M3 state-layer hover)
 *
 * widget 안에서 raw `opacity: 0.32` ❌ — 이 슬롯 함수만 호출.
 * disabled/ghost 약화는 opacity 가 아니라 semantic 색(text/surface 'weak')으로.
 */
export type AlphaSlot = 'scrim' | 'overlay' | 'press' | 'hover'

/**
 * @demo type=value fn=alpha args=["scrim"]
 */
export const alpha = (slot: AlphaSlot) => `var(--ds-opacity-${slot})`

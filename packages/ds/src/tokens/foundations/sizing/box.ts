/**
 * box semantic — width/height slot bundle.
 *
 *   icon       --ds-size-md   (24px) — Material/Carbon 기본 아이콘
 *   avatar     --ds-size-xl   (40px) — list row avatar
 *   thumbnail  --ds-size-2xl  (48px) — preview thumbnail
 *   control    --ds-control-h        — button/input height (기존 토큰 참조)
 *
 * widget 안에서 raw `width: 24px` ❌ — boxSize(slot) 호출.
 */
export type BoxSlot = 'icon' | 'avatar' | 'thumbnail' | 'control'

const SLOT_VAR: Record<BoxSlot, string> = {
  icon:      'var(--ds-size-md)',
  avatar:    'var(--ds-size-xl)',
  thumbnail: 'var(--ds-size-2xl)',
  control:   'var(--ds-control-h)',
}

/**
 * @demo type=value fn=boxSize args=["icon"]
 */
export const boxSize = (slot: BoxSlot) => SLOT_VAR[slot]

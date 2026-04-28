/**
 * z-index semantic — 표준 stack ladder.
 *
 *   base       0  - 일반 흐름
 *   dropdown   1000 - select·combobox panel
 *   sticky     1100 - sticky header / table head
 *   overlay    1200 - scrim / page-level overlay
 *   modal      1300 - dialog / sheet
 *   toast      1400 - transient notification
 *   tooltip    1500 - top of stack
 *
 * Tailwind z-{0,10,...,50}, Bootstrap $zindex-*, Carbon $z-modal 패턴 수렴.
 */
export type ZSlot = 'base' | 'dropdown' | 'sticky' | 'overlay' | 'modal' | 'toast' | 'tooltip'

/**
 * @demo type=value fn=level args=["overlay"]
 */
export const level = (slot: ZSlot) => `var(--ds-z-${slot})`

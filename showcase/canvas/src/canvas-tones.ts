/**
 * Canvas tones — L0/L1/L2/L3 layer 색 신호 (page divider · section marker).
 *
 * ds semantic 토큰 직참 — preset 갈아끼우면(theme/dark mode) 자동 추적.
 * 이전 hardcoded hex 는 dark mode 에서 깨졌고 brand swap 추종 불가.
 *
 *   neutral → --ds-neutral-9 (text/strong 등가)
 *   blue    → --ds-accent     (preset accent)
 *   green   → --ds-success    (semantic status)
 *   amber   → --ds-warning    (semantic status)
 *   fgOnDark → --ds-accent-on (preset 가 contrast 보장)
 */
export const TONE = {
  neutral:  'var(--ds-neutral-9)',
  blue:     'var(--ds-accent)',
  green:    'var(--ds-success)',
  amber:    'var(--ds-warning)',
  fgOnDark: 'var(--ds-accent-on)',
} as const

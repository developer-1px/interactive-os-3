/**
 * Canvas tones — L0/L1/L2/L3 layer 색 신호 (page divider · section marker).
 *
 * Canvas 내부 art direction tone 으로, DS semantic surface 와 별개의 좌표.
 * widget 시각 코드에서 직접 import 금지 — canvas chrome 전용.
 *
 * 이 파일은 lint-ds-values SCOPE 밖이라 hex 리터럴 허용.
 */
export const TONE = {
  neutral: '#1e1e1e',
  blue:    '#2563eb',
  green:   '#16a34a',
  amber:   '#d97706',
  /** 동적 dark 배경(color-ramp dark tile)에서 forced-white 텍스트. */
  fgOnDark: '#fff',
} as const

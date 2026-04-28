/**
 * typography/ — semantic role tokens.
 *   role.ts       → type[role] · typography(role) — widget 이 쓸 어휘.
 *   heading.ts    → headingSize / headingFluid / trackingScale / underlineOffset.
 *   microLabel.ts → micro caption mixin.
 *
 * 구조 분리 — scale.ts (font/weight/tracking/leading) 는 palette/font.ts 가 SSoT.
 * widget 이 raw scale 이 필요하면 `from '@p/ds/tokens/palette'` 명시 import.
 */
export * from './heading'
export * from './role'
export * from './microLabel'

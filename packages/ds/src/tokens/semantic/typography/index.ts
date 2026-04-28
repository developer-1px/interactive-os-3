/**
 * typography/ — semantic role tokens.
 *   role.ts       → type[role] · typography(role) — widget 이 쓸 어휘.
 *   heading.ts    → headingSize / headingFluid / trackingScale / underlineOffset.
 *   microLabel.ts → micro caption mixin.
 *
 * raw scale (font/weight/tracking/leading) 의 SSoT 는 scalar/font.ts.
 * widget 이 raw scale 이 필요하면 `from '@p/ds/tokens/scalar'` 명시 import.
 */
export * from './heading'
export * from './role'
export * from './microLabel'
